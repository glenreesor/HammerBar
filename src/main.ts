// Copyright 2024 Glen Reesor
//
// This file is part of HammerBar.
//
// HammerBar is free software: you can redistribute it and/or
// modify it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or (at your
// option) any later version.
//
// HammerBar is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.
//
// You should have received a copy of the GNU General Public License along with
// HammerBar. If not, see <https://www.gnu.org/licenses/>.

import { VERSION, BUILD_DATE, GIT_HASH } from './version';

import type { ScreenInfoType } from './hammerspoonUtils';
import { getScreenInfo } from './hammerspoonUtils';

import panel from './panel';
import type { WidgetBuildingInfo } from './panel';
import { printDiagnostic } from './utils';
import { getWindowListBuilder } from './windowList';

type Config = {
  panelHeight: number;
  windowStatusUpdateInterval: number;
};

const config: Config = {
  panelHeight: 45,
  windowStatusUpdateInterval: 1,
};

type State = {
  panels: { cleanupPriorToDelete: () => void }[];
  primaryScreenWidgets: {
    left: WidgetBuildingInfo[];
    right: WidgetBuildingInfo[];
  };
  secondaryScreenWidgets: {
    left: WidgetBuildingInfo[];
    right: WidgetBuildingInfo[];
  };
  screensById: Map<number, ScreenInfoType>;
  screenWatcher:
    | {
        start: () => hs.screen.ScreenWatcher;
        stop: () => hs.screen.ScreenWatcher;
      }
    | undefined;
};

const state: State = {
  panels: [],
  primaryScreenWidgets: {
    left: [],
    right: [],
  },
  secondaryScreenWidgets: {
    left: [],
    right: [],
  },
  screensById: new Map(),
  screenWatcher: undefined,
};

function createPanelsForAllScreens() {
  const primaryScreenId = hs.screen.primaryScreen().id();

  const errorFreeWidgetBuildersPrimaryLeft =
    state.primaryScreenWidgets.left.filter((w) => validateWidgetConfig(w));
  const errorFreeWidgetBuildersPrimaryRight =
    state.primaryScreenWidgets.right.filter((w) => validateWidgetConfig(w));

  const errorFreeWidgetBuildersSecondaryLeft =
    state.secondaryScreenWidgets.left.filter((w) => validateWidgetConfig(w));
  const errorFreeWidgetBuildersSecondaryRight =
    state.secondaryScreenWidgets.right.filter((w) => validateWidgetConfig(w));

  hs.screen.allScreens().forEach((hammerspoonScreen) => {
    const screenInfo = getScreenInfo(hammerspoonScreen);
    printDiagnostic(
      `Adding panel for screen ${screenInfo.name} (id: ${screenInfo.id})`,
    );

    state.screensById.set(screenInfo.id, screenInfo);

    const leftWidgets =
      screenInfo.id === primaryScreenId
        ? errorFreeWidgetBuildersPrimaryLeft
        : errorFreeWidgetBuildersSecondaryLeft;

    const rightWidgets =
      screenInfo.id === primaryScreenId
        ? errorFreeWidgetBuildersPrimaryRight
        : errorFreeWidgetBuildersSecondaryRight;

    state.panels.push(
      panel({
        coords: {
          x: screenInfo.x,
          y: screenInfo.y + screenInfo.height - config.panelHeight,
        },
        dimensions: {
          w: screenInfo.width,
          h: config.panelHeight,
        },
        widgetsBuildingInfo: {
          left: leftWidgets,
          right: rightWidgets,
        },
        windowListBuilder: getWindowListBuilder(
          screenInfo.id,
          config.windowStatusUpdateInterval,
        ),
      }),
    );
  });
}

function validateWidgetConfig(buildingInfo: WidgetBuildingInfo): boolean {
  if (buildingInfo.buildErrors.length === 0) {
    return true;
  }
  print(`Error building widget ${buildingInfo.name}:`);
  buildingInfo.buildErrors.forEach((txt) => print(`    ${txt}`));

  return false;
}

function verticallyMaximizeCurrentWindow() {
  const currentWindow = hs.window.focusedWindow();
  const screenInfo = getScreenInfo(currentWindow.screen());
  currentWindow.setFrame({
    x: currentWindow.frame().x,
    y: screenInfo.y,
    w: currentWindow.frame().w,
    h: screenInfo.height - config.panelHeight,
  });
}

function removeAllPanels() {
  printDiagnostic('Removing panels for all screens');
  state.panels.forEach((p) => p.cleanupPriorToDelete());
  state.panels = [];
}

function watchForScreenChanges() {
  // Not all screen changes as reported by Hammerspoon result in different
  // name, x, y, width, or height (the things we care about). So only recreate
  // panels if one or more of those has changed
  const newScreenList = hs.screen.allScreens();
  let recreateRequired = false;

  if (newScreenList.length !== state.screensById.size) {
    recreateRequired = true;
  } else {
    newScreenList.forEach((ns) => {
      const newScreenInfo = getScreenInfo(ns);
      const existingScreen = state.screensById.get(newScreenInfo.id);
      const screenInfoMatches =
        existingScreen &&
        existingScreen.x === newScreenInfo.x &&
        existingScreen.y === newScreenInfo.y &&
        existingScreen.width === newScreenInfo.width &&
        existingScreen.height === newScreenInfo.height;

      recreateRequired = recreateRequired || !screenInfoMatches;
    });
  }

  if (recreateRequired) {
    printDiagnostic('Screen configuration changed');
    state.screensById = new Map();
    removeAllPanels();
    createPanelsForAllScreens();
  }
}

//----------------------------------------------------------------------------

export function addWidgetsPrimaryScreenLeft(
  buildingInfo: WidgetBuildingInfo[],
) {
  buildingInfo.forEach((b) => state.primaryScreenWidgets.left.push(b));
}

export function addWidgetsPrimaryScreenRight(
  buildingInfo: WidgetBuildingInfo[],
) {
  buildingInfo.forEach((b) => state.primaryScreenWidgets.right.push(b));
}

export function addWidgetsSecondaryScreenLeft(
  buildingInfo: WidgetBuildingInfo[],
) {
  buildingInfo.forEach((b) => state.secondaryScreenWidgets.left.push(b));
}

export function addWidgetsSecondaryScreenRight(
  buildingInfo: WidgetBuildingInfo[],
) {
  buildingInfo.forEach((b) => state.secondaryScreenWidgets.right.push(b));
}

export function setWindowStatusUpdateInterval(newInterval: number) {
  config.windowStatusUpdateInterval = newInterval;
}

export function start() {
  printDiagnostic(`Version   : ${VERSION}`);
  printDiagnostic(`Build Date: ${BUILD_DATE}`);
  printDiagnostic(`Git Hash  : ${GIT_HASH}`);

  hs.hotkey.bind('command ctrl', 'up', verticallyMaximizeCurrentWindow);
  createPanelsForAllScreens();
  state.screenWatcher = hs.screen.watcher.new(watchForScreenChanges);
  state.screenWatcher.start();
}

export function stop() {
  removeAllPanels();
  state.screenWatcher?.stop();
}
