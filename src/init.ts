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

const VERSION = '0.9';

import { AppMenuEntryConfigType, LauncherConfigType } from './types';
import {
  ScreenInfoType,
  WindowInfoType,
  getScreenInfo,
  getWindowInfo,
} from './hammerspoonUtils';

import Panel from './Panel';
import type { WidgetBuilder } from './Panel';
import Taskbar from './Taskbar';
import { printDiagnostic } from './utils';
import { getAppLauncherBuilder } from './widgets/appLauncher';
import { getClockBuilder } from './widgets/clock';

type ConfigV2 = {
  panelHeight: number;
};

const configV2: ConfigV2 = {
  panelHeight: 45,
};

interface ConfigType {
  fontSize: number;
  showClock: boolean;
  taskbarHeight: number;
  taskbarColor: hs.ColorType;
  launchers: LauncherConfigType[];
  bundleIdsRequiringFocusHack: string[];
}

const config:ConfigType = {
  fontSize: 13,
  showClock: false,
  taskbarHeight: 45,
  taskbarColor: { red: 220/255, green: 220/255, blue: 220/255 },
  launchers: [],
  bundleIdsRequiringFocusHack: [],
};

interface StateType {
  allowAllWindows: boolean;
  clockTimer?: hs.TimerType;
  taskbarsByScreenId: Map<number, Taskbar>;
  taskbarsAreVisible: boolean;
  windowFilter: hs.WindowFilter | undefined;
}

const state:StateType = {
  allowAllWindows: false,
  clockTimer: undefined,
  taskbarsByScreenId: new Map<number, Taskbar>(),
  taskbarsAreVisible: true,
  windowFilter: undefined,
};

//-----------------------------------------------------------------------------

function verticallyMaximizeCurrentWindow() {
  const currentWindow = hs.window.focusedWindow();
  if (currentWindow) {
    const screenInfo = getScreenInfo(currentWindow.screen());
    currentWindow.setFrame({
      x: currentWindow.frame().x,
      y: screenInfo.y,
      w: currentWindow.frame().w,
      h: screenInfo.height - config.taskbarHeight,
    });
  }
}

/**
 * Launch the app corresponding to the specified bundleId, using a hack to
 * work around Hammerspoon focus bug if required
 */
function launchAppWithOptionalHack(this: void, bundleId: string) {
    hs.application.launchOrFocusByBundleID(bundleId);

    function waitAndApplyFocusHack() {
      print('');
      print('    Looking for app');
      const launchedApp = hs.application.find(bundleId);
      if (!launchedApp) {
        print('    Not found');
        hs.timer.doAfter(1, waitAndApplyFocusHack);
        return;
      }

      print('    Found. Looking for at least one window.');

      const appWindows = launchedApp.allWindows();
      if (appWindows.length === 0) {
        print('    Not found.');
        hs.timer.doAfter(1, waitAndApplyFocusHack);
        return;
      }

      print('    Found. Applying focus hack.');

      // For whatever reason, this set of steps works around the Hammerspoon
      // bug where some apps like Firefox and LibreOffice don't generate any
      // window filter events until they've been focused after a different app
      // has been focused.
      launchedApp.hide();
      launchedApp.unhide();
      hs.application.launchOrFocusByBundleID(bundleId);
    }

    if (config.bundleIdsRequiringFocusHack.includes(bundleId)) {
      print(`App ${bundleId} requires focus hack`);
      waitAndApplyFocusHack();
    }
}


/**
 * Handle clicking on an app button in a taskbar.
 *
 * If no keyboard modifiers are pressed, this function will toggle visibility of
 * the corresponding app.
 *
 * If Shift is also pressed:
 *  - print window info to the Hammerspoon console (this includes the bundleId,
 *    which users will need if they want to add the clicked app to a menu)
 *
 * If Command or Control is pressed:
 *  - Just focus the window (for example if it's not minimized, but obscured
 *    by another window, this will bring it to the foreground)
 *
 * @param this     Must be `void` so it plays nicely with lua
 * @param _canvas  Unused
 * @param _message Unused
 * @param id       The ID of the clicked canvas element. We're expecting this
 *                 to be the window's ID
 */
function onTaskbarWindowButtonClick(
  this: void,
  _canvas: hs.CanvasType,
  _message: string,
  id: string | number
) {
  const idAsNumber = (typeof id === 'number') ? id : parseInt(id);

  // We can't use hs.window.get() because it causes a gigantic delay if other
  // tools like RectangleWM are running
  const allWindows = state.windowFilter?.getWindows() || [];
  const hsWindow = allWindows.filter((window) => window.id() === idAsNumber)[0];

  // We have to check for null because it may have been closed after the most
  // recent taskbar update
  if (!hsWindow) {
    return;
  }

  const keyboardModifiers = hs.eventtap.checkKeyboardModifiers();

  if (keyboardModifiers.shift) {
    // User just wants to dump the window info without toggling window visibility
    printWindowInfo(hsWindow);
    return;
  }

  if (hsWindow.isMinimized()) {
    // Most apps require just focus(), but some like LibreOffice also require raise()
    hsWindow.raise();
    hsWindow.focus();
  } else {
    if (keyboardModifiers.cmd || keyboardModifiers.ctrl) {
      // Just focus() the window because user just wants to make it visible
      // instead of minimizing it
      hsWindow.focus();
    } else {
      hsWindow.minimize();
    }
  }
}

function onToggleButtonClick(this: void) {
  toggleTaskbarVisibility();
  updateAllTaskbars();
}

/**
 * Print a bunch of information to the Hammerspoon console for the specified window.
 *
 * This is useful for debugging or getting the app's bundle ID so users can add
 * the app to a menu
 */
function printWindowInfo(hsWindow: hs.WindowType) {
  const window = getWindowInfo(hsWindow);
  printDiagnostic([
    `appName    : ${window.appName}`,
    `bundleId   : ${window.bundleId}`,
    `id         : ${window.id}`,
    `isMinimized: ${window.isMinimized}`,
    `isStandard : ${window.isStandard}`,
    `role       : ${window.role}`,
    `screenId   : ${window.screenId}`,
    `windowTitle: ${window.windowTitle}`,
  ]);
}

/**
 * Tell the Hammerspoon window filter which window events we're interested in
 * and what callback to use when any of those events are triggered
 */
function subscribeWindowFilterToEvents() {
  state.windowFilter?.subscribe(
    [
      hs.window.filter.windowCreated,
      hs.window.filter.windowDestroyed,

      // This is the Mac "hide" functionality
      hs.window.filter.windowHidden,
      hs.window.filter.windowMinimized,

      // Need this to handle when window moved to another screen
      hs.window.filter.windowMoved,

      // For keeping text in taskbar up to date
      hs.window.filter.windowTitleChanged,

      hs.window.filter.windowUnhidden,

      // This only fires if window was *Hidden* then unminimized
      hs.window.filter.windowUnminimized,

      // This is the only way to trigger when a window is unminimized (but
      // wasn't "hidden" prior to that)
      hs.window.filter.windowVisible,
    ],
    updateAllTaskbars,
  );
}

function toggleTaskbarVisibility() {
  state.taskbarsAreVisible = !state.taskbarsAreVisible;
}

/**
 * Update the contents of all taskbars (there will be multiple taskbars if
 * there are multiple screens)
 */
function updateAllTaskbars() {
  const allWindows:WindowInfoType[] = [];
  const allScreens:ScreenInfoType[] = [];

  state.windowFilter?.getWindows().forEach((hammerspoonWindow) => {
    const windowInfo = getWindowInfo(hammerspoonWindow);

    // Even though our Hammerspoon window filter excludes windows that don't
    // have a role of 'AXWindow', it appears some still get through.
    // So ensure a proper role here.
    if (windowInfo.role === 'AXWindow') {
      allWindows.push(windowInfo);
    }
  });

  //----------------------------------------------------------------------------
  // Update things that may have changed since our last call:
  //  - screens may have been added or removed
  //----------------------------------------------------------------------------
  hs.screen.allScreens().forEach((hammerspoonScreen) => {
    const screenInfo = getScreenInfo(hammerspoonScreen);
    allScreens.push(screenInfo);
  });

  ensureTaskbarsExistForAllScreens(allScreens);

  allScreens.forEach((screen) => {
    const windowsThisScreen = allWindows.filter(
      (window) => window.screenId === screen.id
    );
    const taskbar = state.taskbarsByScreenId.get(screen.id);
    if (!taskbar) {
      printDiagnostic(
        `Unexpected error: No taskbar for screen ${screen.name} (${screen.id})`
      );
    } else {
      taskbar.update(state.taskbarsAreVisible, windowsThisScreen);
    }
  });
}

/**
 * Ensure a taskbar exists for each screen, since user may add or remove monitors
 */
function ensureTaskbarsExistForAllScreens(allScreens: ScreenInfoType[]) {

  // Ensure each screen has a corresponding taskbar with proper coordinates
  // and size.
  // Screen positions can change when monitors are added or removed.
  // Screen sizes can change due to retina displays reporting different resolutions
  // depending on whether external monitors are attached or not
  allScreens.forEach((screen) => {
    const taskbar = state.taskbarsByScreenId.get(screen.id);
    if (taskbar) {
      taskbar.updateSizeAndPosition(screen);
    } else {
      printDiagnostic(`Adding taskbar for screen ${screen.name} (${screen.id})`);

      const newTaskbar = new Taskbar({
        fontSize: config.fontSize,
        height: config.taskbarHeight,
        screenInfo: screen,
        backgroundColor: config.taskbarColor,
        launchers: config.launchers,
        showClock: config.showClock,
        onToggleButtonClick: onToggleButtonClick,
        onWindowButtonClick: onTaskbarWindowButtonClick,
        launchAppWithOptionalHack: launchAppWithOptionalHack,
      });

      state.taskbarsByScreenId.set(screen.id, newTaskbar);
    }
  });

  // Remove taskbars for screens that no longer exist
  state.taskbarsByScreenId.forEach((taskbar, screenId) => {
    const foundScreens = allScreens.filter((screen) => screen.id === screenId);
    if (foundScreens.length === 0) {
      printDiagnostic(`Removing taskbar for screen ${screenId}`);

      // We know it'll eventually get garbage collected, but make it invisible
      // in case screen topology changes prior to garbage collection
      taskbar.update(false, []);
      state.taskbarsByScreenId.delete(screenId);
    }
  });
}

/**
 * A callback for the Hammerspoon window filter. This returns whether the
 * specified window should be included in our list of windows in the taskbar.
 *
 * We need this because there are many Mac "windows" that don't actually
 * correspond to something you'd normally see in a taskbar
 */
function windowFilterCallback(this: void, hsWindow: hs.WindowType) {
  if (state.allowAllWindows) {
    return true;
  }

  // Based on the HammerSpoon docs, you'd think we could just filter out
  // windows that are not "standard". However that also filters out some
  // windows that we want in the taskbar. For instance the following are all
  // classified as not "standard" (but only when they're minimized):
  //  - gitk
  //  - Safari
  //  - DBeaver
  //
  // It looks like the windows we want in the taskbar all have a "role" of
  // "AXWindow".
  //
  // Ironically Hammerspoon has its own weirdness to account for:
  //  - the Console is "standard" unless it's minimized -- then it's not "standard"
  //  - there are other windows associated with Hammerspoon (that we don't care
  //    about), all of which have a role of "AXWindow" but they are not "standard"
  const window = getWindowInfo(hsWindow);
  return (
    (window.appName === 'Hammerspoon' && window.windowTitle === 'Hammerspoon Console') ||
    (window.appName !== 'Hammerspoon' && window.role === 'AXWindow')
  );
}

/**
 * Determine if user-supplied configuraton for an app launcher is correct
 *
 * @returns true or an array of strings to be presented to the user
 */
function validateAppLauncherConfig(bundleId: any): true | string[] {
  if (typeof bundleId === 'string') return true;

  return [
    'You need to specify a bundleId (a string) but this was received instead:',
    hs.inspect.inspect(bundleId),
  ];
}

/**
 * Determine if user-supplied configuraton for an app menu is correct
 *
 * @returns true or an array of strings to be presented to the user
 */
function validateAppMenuConfig(menuConfig: any): true | string[] {
  const errors: string[] = [];

  if (typeof(menuConfig) !== 'object') {
    errors.push('You need to specify a table, but this was received instead:');
    errors.push(hs.inspect.inspect(menuConfig));
  }

  if (errors.length === 0 && (menuConfig as AppMenuEntryConfigType[]).length === 0) {
    errors.push('You need to specify a list of menu items, but this was received instead:');
    errors.push(hs.inspect.inspect(menuConfig));
  }

  if (errors.length === 0) {
    (menuConfig as AppMenuEntryConfigType[]).forEach((menuItem, index) => {
      // Remember that lua users are expecting array indexes to start at 1
      const errorIndex = index + 1;

      if (!menuItem.bundleId || typeof menuItem.bundleId !== 'string') {
        errors.push(`Menu item ${errorIndex} is missing a bundleId string. This was received instead:`);
        errors.push(hs.inspect.inspect(menuItem));
      }

      if (!menuItem.displayName || typeof menuItem.displayName !== 'string') {
        errors.push(`Menu item ${errorIndex} is missing a displayName string. This was received instead:`);
        errors.push(hs.inspect.inspect(menuItem));
      }
    });
  }

  if (errors.length === 0) return true;

  return errors.concat([
    '',
    'A valid menu looks like this:',
    '{',
    '    {',
    '        bundleId = "org.mozilla.firefox",',
    '        displayName = "Firefox",',
    '    }',
    '    {',
    '        bundleId = "com.googlecode.iterm2",',
    '        displayName = "Chrome",',
    '    }',
    '}',
    '',
    'If you\'re not sure of the bundleId, start the application then shift-click',
    'on the icon in the taskbar. The bundleId (and other information) will be',
    'printed to the Hammerspoon console',
  ]);
}

function validateFocusHackAppsArg(arg: any): true | string[] {
  const errors = [];
  if (!Array.isArray(arg)) {
    errors.push('Argument must be a list');
  }

  if (errors.length === 0) {
    // Need this type assertion so typescript to lua compiler will properly
    // polyfill
    (arg as any[]).forEach((element: any, i: number) => {
      if (typeof element !== 'string') {
        errors.push(`Element ${i + 1} must be a bundleID string, like 'org.mozilla.firefox'`);
      }
    });
  }

  return errors.length === 0 ? true : errors;
}
//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Add a list of apps to be displayed when an Taskbar button is clicked.
 * See the validator function for syntax.
 */
export function addAppMenu(menuConfig: any) {
  const validation = validateAppMenuConfig(menuConfig);

  if (validation === true) {
    config.launchers.push({ type: 'appMenu', apps: menuConfig });
  } else {
    printDiagnostic(['Error encountered with addAppMenu()'].concat(validation));
  }

}

/**
 * Add a single app button to the Taskbar
 */
export function addAppLauncher(bundleId: any) {
  const validation = validateAppLauncherConfig(bundleId);

  if (validation === true) {
    config.launchers.push({ type: 'app', bundleId: bundleId });
  } else {
    printDiagnostic(['Error encountered with addAppLauncher()'].concat(validation));
  }
}

/**
 * Add a clock to the right side of the Taskbar
 */
export function addClock() {
  config.showClock = true;
}

/**
 * Add a button to the Taskbar that will display the OS launcher
 */
export function addLaunchpadLauncher() {
  config.launchers.push({ type: 'app', bundleId: 'com.apple.launchpad.launcher' });
}

// Use this function to allow *all* windows reported by HammerSpoon in the
// taskbar. This will be useful if a window isn't showing up normally. So with
// this enabled, user can shift-click on the window button in question and get
// all the hammerspoon info about it
export function allowAllWindows() {
  state.allowAllWindows = true;
}

export function setFocusHackApps(bundleIds: any[]) {
  const validation = validateFocusHackAppsArg(bundleIds);

  if (validation === true) {
    config.bundleIdsRequiringFocusHack = bundleIds;
  } else {
    printDiagnostic(['Error encountered with setFocusHackApps()'].concat(validation));
  }
}

export function start() {
  printDiagnostic(`Version: ${VERSION}`);
  hs.hotkey.bind('command ctrl', 'up', verticallyMaximizeCurrentWindow);
  state.windowFilter = hs.window.filter.new(windowFilterCallback);
  subscribeWindowFilterToEvents();
  updateAllTaskbars();

  if (config.showClock) {
    // Schedule clock updates every minute starting at 0s of the next minute
    // and every 60s thereafter
    const now = os.date('*t') as os.DateTable;
    state.clockTimer = hs.timer.doAfter(
      60 - now.sec,
      () => {
        updateAllTaskbars()
        state.clockTimer = hs.timer.doEvery(60, updateAllTaskbars);
      }
    );
  }
}

const panels: { destroy: () => void }[] = [];

export function startV2() {
  const panelColor = { red: 100/255, green: 100/255, blue: 100/255 };

  hs.hotkey.bind('command ctrl', 'up', verticallyMaximizeCurrentWindow);

  const widgetBuilders: WidgetBuilder[] = [
    getAppLauncherBuilder('org.mozilla.firefox'),
    getAppLauncherBuilder('com.google.Chrome'),
    getClockBuilder(),
  ];

  hs.screen.allScreens().forEach((hammerspoonScreen) => {
    const screenInfo = getScreenInfo(hammerspoonScreen);

    // Two panels for testing
    panels.push(Panel({
      x: screenInfo.x,
      y: screenInfo.y + screenInfo.height - 3 * configV2.panelHeight,
      width: screenInfo.width,
      height: configV2.panelHeight,
      color: panelColor,
      widgetBuilders,
    }));

    panels.push(Panel({
      x: screenInfo.x,
      y: screenInfo.y + screenInfo.height - 5 * configV2.panelHeight,
      width: screenInfo.width,
      height: configV2.panelHeight,
      color: panelColor,
      widgetBuilders,
    }));
  });
}

export function stop() {
  state.windowFilter?.unsubscribeAll();
  state.clockTimer?.stop();
}

