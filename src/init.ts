import {
  MAX_BUTTON_WIDTH,
  TOGGLE_BUTTON_WIDTH,
  getCanvasHeight,
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

//-----------------------------------------------------------------------------
// Other config
//-----------------------------------------------------------------------------
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
  doitTimer: hs.TimerType | undefined;
  previousWindowList: Array<WindowInfoType>;
  taskbarsAreVisible: boolean;
}

const state:StateType = {
  canvasesByScreenId: new Map<number, CanvasesOneScreenType>(),
  doitTimer: undefined,
  previousWindowList: [],
  taskbarsAreVisible: true,
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
  const hsWindow = hs.window.get(idAsNumber);

  // We have to check for null because it may have been closed after the most
  // recent taskbar update
  if (!hsWindow) {
    return;
  }

  if (hsWindow.isMinimized()) {
    // Most apps require just focus(), but some like LibreOffice also require raise()
    hsWindow.raise();
    hsWindow.focus();
  } else {
    if (hs.eventtap.checkKeyboardModifiers().cmd) {
      hsWindow.focus();
    } else {
      hsWindow.minimize();
    }
  }

  updateAllTaskbars();
}

function onToggleButtonClick(this: void) {
  toggleTaskbarVisibility();
  updateAllTaskbars(true);
}

function toggleTaskbarVisibility() {
  state.taskbarsAreVisible = !state.taskbarsAreVisible;
}

function updateAllTaskbars(force = false) {
  const allWindows:WindowInfoType[] = [];
  const allScreens:ScreenInfoType[] = [];

  hs.window.allWindows().forEach((hammerspoonWindow) => {
    const windowInfo = getWindowInfo(hammerspoonWindow);
    allWindows.push(windowInfo);
  });

  if (!force && windowListsAreIdentical(state.previousWindowList, allWindows)) {
    // If nothing has changed, no point taking the effort to re-render taskbars
    return;
  }

  state.previousWindowList = allWindows;

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

      const canvasHeight = getCanvasHeight(config.fontSize);

      const newLeftToggleCanvas = hs.canvas.new({
        x: screen.x,
        y: screen.y + screen.height - canvasHeight,
        w: TOGGLE_BUTTON_WIDTH,
        h: canvasHeight,
      });

      const newRightToggleCanvas = hs.canvas.new({
        x: screen.x + screen.width - TOGGLE_BUTTON_WIDTH,
        y: screen.y + screen.height - canvasHeight,
        w: TOGGLE_BUTTON_WIDTH,
        h: canvasHeight,
      });

      const newWindowButtonsCanvas = hs.canvas.new({
        x: screen.x + TOGGLE_BUTTON_WIDTH,
        y: screen.y + screen.height - canvasHeight,
        w: screen.width - 2 * TOGGLE_BUTTON_WIDTH,
        h: canvasHeight,
      });

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

/**
 * Return whether the two lists of windows are identical in all ways that
 * affect whether a re-render of taskbars is required
 */
function windowListsAreIdentical(
  windowList1: Array<WindowInfoType>,
  windowList2: Array<WindowInfoType>
): boolean {
  if (windowList1.length !== windowList2.length) {
    return false;
  }

  const windowListById1 = new Map<number, WindowInfoType>();
  const windowListById2 = new Map<number, WindowInfoType>();

  windowList1.forEach((window) => windowListById1.set(window.id, window));
  windowList2.forEach((window) => windowListById2.set(window.id, window));

  const windowListsAreIdentical = windowList1.reduce((accumulator, window) => {
    const windowFromList2 = windowListById2.get(window.id);
    return accumulator && (
      windowFromList2 !== undefined &&
      windowFromList2.appName == window.appName &&
      windowFromList2.windowTitle == window.windowTitle &&
      windowFromList2.isMinimized == window.isMinimized &&
      windowFromList2.screenId == window.screenId
    );
  },
  true);

  return windowListsAreIdentical;
}

//------------------------------------------------------------------------------
// Name space these functions so it's obvious they're just for testing and
// not to be called directly from other hammerspoon code
export const testableFunctions = {
  orderWindowsConsistently,
  windowListsAreIdentical,
};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

export function setAppNamesAndWindowTitles(appNamesAndWindowTitles: Array<AppNameAndWindowTitleType>) {
  config.userAppNamesAndWindowTitles = appNamesAndWindowTitles;
}

export function start() {
  updateAllTaskbars();
  state.doitTimer = hs.timer.doEvery(0.5, updateAllTaskbars);
}

export function stop() {
  if (state.doitTimer) {
    state.doitTimer.stop();
  }
}

