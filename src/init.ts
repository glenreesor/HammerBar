import {
  MAX_BUTTON_WIDTH,
  TOGGLE_BUTTON_WIDTH,
  getNewLeftToggleCanvas,
  getNewRightToggleCanvas,
  getNewWindowButtonCanvas,
  getToggleButtonElements,
  getTaskbarElements,
  getWindowButtonElements,
} from './drawing';

import {
  ScreenInfoType,
  WindowInfoType,
  getScreenInfo,
  getWindowInfo,
} from './hammerspoonUtils';

interface AppNameAndWindowTitleType {
  appName: string;
  windowTitle?: string;
  displayAppName?: string;
  displayWindowTitle?: string;
}

interface ConfigType {
  fontSize: number;
  defaultColors: {
    taskbar: hs.ColorType;
    icons: hs.ColorType;
  };
  userAppNamesAndWindowTitles?: Array<AppNameAndWindowTitleType>;
}

const config:ConfigType = {
  fontSize: 13,
  defaultColors: {
    taskbar: { red: 220/255, green: 220/255, blue: 220/255 },
    icons:   { red: 132/255, green: 132/255, blue: 130/255 },
  },
};

interface CanvasesOneScreenType {
  leftToggle: hs.CanvasType;
  rightToggle: hs.CanvasType;
  windowButtons: hs.CanvasType;
}

interface StateType {
  canvasesByScreenId: Map<number, CanvasesOneScreenType>;
  taskbarsAreVisible: boolean;
  windowFilter: hs.WindowFilter | undefined;
}

const state:StateType = {
  canvasesByScreenId: new Map<number, CanvasesOneScreenType>(),
  taskbarsAreVisible: true,
  windowFilter: undefined,
};

//-----------------------------------------------------------------------------

function getAppNameAndWindowTitle(
  window: WindowInfoType
): {appNameToDisplay: string, windowTitleToDisplay: string} {
  const userConfig = config.userAppNamesAndWindowTitles ? config.userAppNamesAndWindowTitles : [];

  let returnValue = {
    appNameToDisplay: window.appName,
    windowTitleToDisplay: window.windowTitle
  }

  userConfig.forEach((configObject) => {
    if (
      configObject.appName === window.appName &&
      (configObject.windowTitle == window.windowTitle || !configObject.windowTitle)
    ) {
      if (configObject.displayAppName) {
        returnValue.appNameToDisplay = configObject.displayAppName;
      }

      if (configObject.displayWindowTitle) {
        returnValue.windowTitleToDisplay = configObject.displayWindowTitle;
      }
    }
  });

  return returnValue
}

/**
 * Get a list of windows that we should show buttons for. We can't just look
 * at the window.isStandard field because it is false for some windows
 * even though we want them to show up in the taskbar.
 *
 * So far now, just filter out Hammerspoon windows with an empty title, since
 * those correspond to canvases, which we definitely don't want to see in
 * the taskbar
 */
function getWindowsToShow(windows: WindowInfoType[]): WindowInfoType[] {
  return windows.filter((window) => {
    return !(window.appName === 'Hammerspoon' && window.windowTitle === '')
  });
}

/**
 * Modify the specified array of windows so they will be ordered consistently
 * every render, independent of the order that Hammerspoon provides them, so
 * the window buttons won't change positions on different renders
 */
function orderWindowsConsistently(windows: WindowInfoType[]): void {
  // Sort by appname so window buttons are grouped by app, and then by
  // window ID within app
  windows.sort((window1, window2) => {
    if (window1.appName < window2.appName) {
      return -1;
    }

    if (window1.appName === window2.appName) {
      if (window1.id < window2.id) {
        return -1;
      }

      if (window1.id === window2.id) {
        // Presumably this will never happen
        return 0;
      }
    }

    return 1;
  });
}

function onTaskbarClick(
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
    allWindows.push(windowInfo);
  });

  //----------------------------------------------------------------------------
  // Update things that may have changed since our last call:
  //  - screens may have been added or removed
  //----------------------------------------------------------------------------
  hs.screen.allScreens().forEach((hammerspoonScreen) => {
    const screenInfo = getScreenInfo(hammerspoonScreen);
    allScreens.push(screenInfo);
  });

  updateCanvasesByScreenId(allScreens);

  allScreens.forEach((screen) => {
    const windowsThisScreen = allWindows.filter(
      (window) => window.screenId === screen.id
    );
    const canvases = state.canvasesByScreenId.get(screen.id);
    if (!canvases) {
      print(`Hammerbar: No canvas for screen ${screen.id}`);
    } else {
      canvases.leftToggle.replaceElements(getToggleButtonElements({
        fontSize: config.fontSize,
        screenSide: 'left',
        taskbarIsVisible: state.taskbarsAreVisible,
      }));

      canvases.rightToggle.replaceElements(getToggleButtonElements({
        fontSize: config.fontSize,
        screenSide: 'right',
        taskbarIsVisible: state.taskbarsAreVisible,
      }));

      updateTaskbar(
        canvases.windowButtons,
        {
          width: screen.width,
          height: screen.height,
        },
        windowsThisScreen,
      );
    }
  });
}

function updateCanvasesByScreenId(allScreens: Array<ScreenInfoType>) {

  // Ensure each screen has a corresponding canvas
  allScreens.forEach((screen) => {
    if (!state.canvasesByScreenId.get(screen.id)) {
      print(`Adding canvases for screen: ${screen.id}`);

      const newLeftToggleCanvas = getNewLeftToggleCanvas(
        {fontSize: config.fontSize, screen: screen}
      );

      const newRightToggleCanvas = getNewRightToggleCanvas(
        {fontSize: config.fontSize, screen: screen}
      );

      const newWindowButtonsCanvas = getNewWindowButtonCanvas(
        {fontSize: config.fontSize, screen: screen}
      );

      newWindowButtonsCanvas.show();
      newLeftToggleCanvas.show();
      newRightToggleCanvas.show();

      state.canvasesByScreenId.set(
        screen.id,
        {
          leftToggle: newLeftToggleCanvas,
          rightToggle: newRightToggleCanvas,
          windowButtons: newWindowButtonsCanvas,
        }
      );

      newWindowButtonsCanvas.mouseCallback(onTaskbarClick);
      newLeftToggleCanvas.mouseCallback(onToggleButtonClick);
      newRightToggleCanvas.mouseCallback(onToggleButtonClick);
    }
  });

  // Remove canvases for screens that no longer exist
  state.canvasesByScreenId.forEach((_canvas, screenId) => {
    const foundScreens = allScreens.filter((screen) => screen.id === screenId);
    if (foundScreens.length === 0) {
      print(`Removing canvases for screen: ${screenId}`);
      state.canvasesByScreenId.delete(screenId);
    }
  });
}

function updateTaskbar(
  canvas: hs.CanvasType,
  dimensions: {width: number, height: number},
  windows: Array<WindowInfoType>
) {
  if (!state.taskbarsAreVisible) {
    canvas.hide();
    return;
  }

  canvas.show();
  canvas.replaceElements(
    getTaskbarElements({
      color: config.defaultColors.taskbar,
      width: dimensions.width,
      height: dimensions.height
    })
  )

  orderWindowsConsistently(windows);
  const windowsToDisplay = getWindowsToShow(windows);

  // Determine width of buttons if we want them to completely fill the taskbar
  // so we can determine a good width
  const exactWidth = (dimensions.width - 2 * TOGGLE_BUTTON_WIDTH) / windows.length;
  const buttonWidth = Math.min(MAX_BUTTON_WIDTH, exactWidth);

  let x = 0;

  windowsToDisplay.forEach((window) => {
    canvas.appendElements(getWindowButtonElements({
      fontSize: config.fontSize,
      buttonWidthIncludingPadding: buttonWidth,
      x: x,
      window,
      getAppNameAndWindowTitle,
    }));
    x += buttonWidth;
  });
}

//------------------------------------------------------------------------------
// Name space these functions so it's obvious they're just for testing and
// not to be called directly from other hammerspoon code
export const testableFunctions = {
  orderWindowsConsistently,
};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

export function setAppNamesAndWindowTitles(appNamesAndWindowTitles: Array<AppNameAndWindowTitleType>) {
  config.userAppNamesAndWindowTitles = appNamesAndWindowTitles;
}

export function start() {
  state.windowFilter = hs.window.filter.new(true);
  subscribeWindowFilterToEvents();
  updateAllTaskbars();
}

export function stop() {
  state.windowFilter?.unsubscribeAll();
}

