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

const VERSION = '0.9+2024-05-19';

import { getScreenInfo } from './hammerspoonUtils';

import Panel from './Panel';
import type { WidgetBuildingInfo } from './Panel';
import { printDiagnostic } from './utils';
import { getAppLauncherBuilder } from './widgets/appLauncher';
import { getAppMenuBuilder } from './widgets/appMenu';
import { getClockBuilder } from './widgets/clock';
import { getLineGraphBuilder } from './widgets/lineGraph';
import { getTextBuilder } from './widgets/text';
import { getWindowListBuilder } from './widgets/windowList';
import { getXEyesBuilder } from './widgets/xeyes';

type Config = {
  panelHeight: number;
};

const config: Config = {
  panelHeight: 45,
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
  screenWatcher:
    | {
        start: () => hs.ScreenWatcher;
        stop: () => hs.ScreenWatcher;
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
  screenWatcher: undefined,
};

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

function validateWidgetConfig(buildingInfo: WidgetBuildingInfo): boolean {
  if (buildingInfo.buildErrors.length === 0) {
    return true;
  }
  print(`Error building widget ${buildingInfo.name}:`);
  buildingInfo.buildErrors.forEach((txt) => print(`    ${txt}`));

  return false;
}

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

    const leftWidgets =
      screenInfo.id === primaryScreenId
        ? errorFreeWidgetBuildersPrimaryLeft
        : errorFreeWidgetBuildersSecondaryLeft;

    const rightWidgets =
      screenInfo.id === primaryScreenId
        ? errorFreeWidgetBuildersPrimaryRight
        : errorFreeWidgetBuildersSecondaryRight;

    state.panels.push(
      Panel({
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
        windowListBuilder: getWindowListBuilder(screenInfo.id),
      }),
    );
  });
}

function removeAllPanels() {
  printDiagnostic('Removing panels for all screens');
  state.panels.forEach((p) => p.cleanupPriorToDelete());
  state.panels = [];
}

function watchForScreenChanges() {
  // When screens get added or removed, resolutions can also change (e.g.
  // on a macbook when external screens are added or removed)
  // So just delete all Panels and recreate from scratch
  removeAllPanels();
  createPanelsForAllScreens();
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

export function start() {
  printDiagnostic(`Version: ${VERSION}`);
  hs.hotkey.bind('command ctrl', 'up', verticallyMaximizeCurrentWindow);
  createPanelsForAllScreens();
  state.screenWatcher = hs.screen.watcher.new(watchForScreenChanges);
  state.screenWatcher.start();
}

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

// Users don't need to be burdened with understanding that they're getting a
// builder, so rename on export
export const widgets = {
  appLauncher: getAppLauncherBuilder,
  appMenu: getAppMenuBuilder,
  clock: getClockBuilder,
  lineGraph: getLineGraphBuilder,
  text: getTextBuilder,
  xeyes: getXEyesBuilder,
};

export function stop() {
  removeAllPanels();
  state.screenWatcher?.stop();
}
