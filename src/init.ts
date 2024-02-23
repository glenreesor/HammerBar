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

const VERSION = '0.9+2024-02-22';

import { getScreenInfo } from './hammerspoonUtils';

import Panel from './Panel';
import type { WidgetBuildingInfo } from './Panel';
import { printDiagnostic } from './utils';
import { getAppLauncherBuilder } from './widgets/appLauncher';
import { getAppMenuBuilder } from './widgets/appMenu';
import { getClockBuilder } from './widgets/clock';
import { getDotGraphBuilder } from './widgets/dotGraph';
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
  widgetsBuildingInfoLeft: WidgetBuildingInfo[]
  widgetsBuildingInfoRight: WidgetBuildingInfo[]
  screenWatcher: {
    start: () => hs.ScreenWatcher;
    stop: () => hs.ScreenWatcher;
  } | undefined;
};

const state: State = {
  panels: [],
  widgetsBuildingInfoLeft: [],
  widgetsBuildingInfoRight: [],
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

function createPanelsForAllScreens() {
  const errorFreeWidgetBuildersLeft: WidgetBuildingInfo[] = [];
  const errorFreeWidgetBuildersRight: WidgetBuildingInfo[] = [];

  state.widgetsBuildingInfoLeft.forEach((info) => {
    if (info.buildErrors.length === 0) {
      errorFreeWidgetBuildersLeft.push(info);
    } else {
      print('Error building widget:');
      info.buildErrors.forEach((txt) => print(`    ${txt}`));
    }
  });

  state.widgetsBuildingInfoRight.forEach((info) => {
    if (info.buildErrors.length === 0) {
      errorFreeWidgetBuildersRight.push(info);
    } else {
      print('Error building widget:');
      info.buildErrors.forEach((txt) => print(`    ${txt}`));
    }
  });

  hs.screen.allScreens().forEach((hammerspoonScreen) => {
    const screenInfo = getScreenInfo(hammerspoonScreen);
    printDiagnostic(`Adding panel for screen ${screenInfo.name} (id: ${screenInfo.id})`);

    state.panels.push(Panel({
      x: screenInfo.x,
      y: screenInfo.y + screenInfo.height - config.panelHeight,
      width: screenInfo.width,
      height: config.panelHeight,
      widgetsBuildingInfo: {
        left: errorFreeWidgetBuildersLeft,
        right: errorFreeWidgetBuildersRight,
      },
      windowListBuilder: getWindowListBuilder(screenInfo.id),
    }));
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

export function addWidgetBuildersLeft(buildingInfo: WidgetBuildingInfo[]) {
  buildingInfo.forEach((b) => state.widgetsBuildingInfoLeft.push(b));
}

export function addWidgetBuildersRight(buildingInfo: WidgetBuildingInfo[]) {
  buildingInfo.forEach((b) => state.widgetsBuildingInfoRight.push(b));
}

export {
  getAppLauncherBuilder,
  getAppMenuBuilder,
  getClockBuilder,
  getDotGraphBuilder,
  getLineGraphBuilder,
  getTextBuilder,
  getXEyesBuilder,
}

export function stop() {
  removeAllPanels();
  state.screenWatcher?.stop();
}

