// Copyright 2024, 2025 Glen Reesor
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

import { console, printIndentedTextBlock } from './util';
import type { ScreenInfoType } from './hammerspoonUtils';
import { getScreenInfo } from './hammerspoonUtils';

import { mainPanel } from './mainPanel';
import type {
  WidgetBuildingInfo,
  WidgetBuildingInfoSuccess,
} from './mainPanel';
import { getWindowButtonsPanelBuilder } from './windowButtonsPanel';
import {
  setWindowListUpdateInterval as applyWindowListUpdateInterval,
  setWindowStateUpdateInterval as applyWindowStateUpdateInterval,
  subscribeToWindowListUpdates,
} from './windowListAndStateWatcher';

type Config = {
  panelHeight: number;
  windowListUpdateInterval: number;
  windowStateUpdateInterval: number;
};

const config: Config = {
  panelHeight: 45,
  windowListUpdateInterval: 1,
  windowStateUpdateInterval: 1,
};

type State = {
  panels: { prepareForRemoval: () => void }[];
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
        start: () => hs.screen.watcher.Watcher;
        stop: () => hs.screen.watcher.Watcher;
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

  const errorFreeWidgetBuildersPrimaryLeft = getErrorFreeWidgetBuilders(
    state.primaryScreenWidgets.left,
  );
  const errorFreeWidgetBuildersPrimaryRight = getErrorFreeWidgetBuilders(
    state.primaryScreenWidgets.right,
  );
  const errorFreeWidgetBuildersSecondaryLeft = getErrorFreeWidgetBuilders(
    state.secondaryScreenWidgets.left,
  );
  const errorFreeWidgetBuildersSecondaryRight = getErrorFreeWidgetBuilders(
    state.secondaryScreenWidgets.right,
  );

  hs.screen.allScreens().forEach((hammerspoonScreen) => {
    const screenInfo = getScreenInfo(hammerspoonScreen);
    console.log(
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
      mainPanel({
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
        windowButtonsPanelBuilder: getWindowButtonsPanelBuilder({
          screenId: screenInfo.id,
          subscribeToWindowListUpdates,
        }),
      }),
    );
  });
}

function getErrorFreeWidgetBuilders(
  buildingInfo: WidgetBuildingInfo[],
): WidgetBuildingInfoSuccess[] {
  const errorFreeBuilders: WidgetBuildingInfoSuccess[] = [];

  buildingInfo.forEach((bi) => {
    if (bi.type === 'success') {
      errorFreeBuilders.push(bi);
    } else {
      printIndentedTextBlock(
        'error',
        `Error building widget ${bi.widgetName}`,
        bi.widgetConfigErrors,
      );
    }
  });

  return errorFreeBuilders;
}

function verticallyMaximizeCurrentWindow() {
  const currentWindow = hs.window.focusedWindow();
  if (!currentWindow) {
    return;
  }

  const screenInfo = getScreenInfo(currentWindow.screen());
  currentWindow.setFrame({
    x: currentWindow.frame().x,
    y: screenInfo.y,
    w: currentWindow.frame().w,
    h: screenInfo.height - config.panelHeight,
  });
}

function removeAllPanels() {
  console.log('Removing panels for all screens');
  state.panels.forEach((p) => p.prepareForRemoval());
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
    console.log('Screen configuration changed');
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

export function setWindowListUpdateInterval(newInterval: number) {
  config.windowListUpdateInterval = newInterval;
}

export function setWindowStateUpdateInterval(newInterval: number) {
  config.windowStateUpdateInterval = newInterval;
}

export function start() {
  hs.hotkey.bind('command ctrl', 'up', verticallyMaximizeCurrentWindow);
  applyWindowListUpdateInterval(config.windowListUpdateInterval);
  applyWindowStateUpdateInterval(config.windowStateUpdateInterval);

  createPanelsForAllScreens();
  state.screenWatcher = hs.screen.watcher.new(watchForScreenChanges);
  state.screenWatcher.start();
}

export function stop() {
  removeAllPanels();
  state.screenWatcher?.stop();
}
