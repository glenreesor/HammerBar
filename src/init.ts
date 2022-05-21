import { AppMenuEntryConfigType, LauncherConfigType } from './types';
import {
  ScreenInfoType,
  WindowInfoType,
  getScreenInfo,
  getWindowInfo,
} from './hammerspoonUtils';

import Taskbar from './Taskbar';

interface ConfigType {
  fontSize: number;
  taskbarHeight: number;
  taskbarColor: hs.ColorType;
  launchers: LauncherConfigType[];
}

const config:ConfigType = {
  fontSize: 13,
  taskbarHeight: 45,
  taskbarColor: { red: 220/255, green: 220/255, blue: 220/255 },
  launchers: [],
};

interface StateType {
  allowAllWindows: boolean;
  taskbarsByScreenId: Map<number, Taskbar>;
  taskbarsAreVisible: boolean;
  windowFilter: hs.WindowFilter | undefined;
}

const state:StateType = {
  allowAllWindows: false,
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

function printWindowInfo(hsWindow: hs.WindowType) {
  const window = getWindowInfo(hsWindow);
  print('');
  print('Window info:');
  print(`    appName    : ${window.appName}`);
  print(`    bundleId   : ${window.bundleId}`);
  print(`    id         : ${window.id}`);
  print(`    isMinimized: ${window.isMinimized}`);
  print(`    isStandard : ${window.isStandard}`);
  print(`    role       : ${window.role}`);
  print(`    screenId   : ${window.screenId}`);
  print(`    windowTitle: ${window.windowTitle}`);
  print('');
}

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
      print(`HammerBar: No taskbar for screen ${screen.id}`);
    } else {
      taskbar.update(state.taskbarsAreVisible, windowsThisScreen);
    }
  });
}

function ensureTaskbarsExistForAllScreens(allScreens: Array<ScreenInfoType>) {

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
      print(`Adding taskbar for screen: ${screen.id}`);


      const newTaskbar = new Taskbar({
        fontSize: config.fontSize,
        height: config.taskbarHeight,
        screenInfo: screen,
        backgroundColor: config.taskbarColor,
        launchers: config.launchers,
        onToggleButtonClick: onToggleButtonClick,
        onWindowButtonClick: onTaskbarWindowButtonClick,
      });

      state.taskbarsByScreenId.set(screen.id, newTaskbar);
    }
  });

  // Remove taskbars for screens that no longer exist
  state.taskbarsByScreenId.forEach((taskbar, screenId) => {
    const foundScreens = allScreens.filter((screen) => screen.id === screenId);
    if (foundScreens.length === 0) {
      print(`Removing taskbar for screen: ${screenId}`);

      // We know it'll eventually get garbage collected, but make it invisible
      // in case screen topology changes prior to garbage collection
      taskbar.update(false, []);
      state.taskbarsByScreenId.delete(screenId);
    }
  });
}

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

function validateAppLauncherConfig(bundleId: any): true | string[] {
  if (typeof bundleId === 'string') return true;

  return [
    'You need to specify a bundleId (a string) but this was received instead:',
    hs.inspect.inspect(bundleId),
  ];
}

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

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

export function addAppMenu(menuConfig: any) {
  const validation = validateAppMenuConfig(menuConfig);

  if (validation === true) {
    config.launchers.push({ type: 'appMenu', apps: menuConfig });
  } else {
    print();
    print('------- HammerBar error :-(');
    print('Error encountered with addAppMenu()');
    validation.forEach((msg) => {
      print(msg);
    });
    print();
  }

}

export function addAppLauncher(bundleId: any) {
  const validation = validateAppLauncherConfig(bundleId);

  if (validation === true) {
    config.launchers.push({ type: 'app', bundleId: bundleId });
  } else {
    print();
    print('------- HammerBar error :-(');
    print('Error encountered with addAppLauncher()');
    validation.forEach((msg) => {
      print(msg);
    });
    print();
  }
}

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

export function start() {
  hs.hotkey.bind('command ctrl', 'up', verticallyMaximizeCurrentWindow);
  state.windowFilter = hs.window.filter.new(windowFilterCallback);
  subscribeWindowFilterToEvents();
  updateAllTaskbars();
}

export function stop() {
  state.windowFilter?.unsubscribeAll();
}

