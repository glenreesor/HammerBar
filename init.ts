import {
  BUTTON_PADDING,
  BUTTON_WIDTH,
  ColorType,
  getButtonHeight,
  getCanvasHeight,
  getTaskbarElements,
  getWindowButtonElements,
} from "./drawing";

import {
  getScreenInfo,
  getWindowInfo,
  ScreenInfoType,
  WindowInfoType,
} from "./hammerspoonUtils";

interface UserColorsType {
  taskbar?: ColorType;
  icons?: ColorType;
  appGroups?: Record<string, ColorType>;
  appNames?: Record<string, ColorType | string>;
}

interface AppNameAndWindowTitleType {
  appName: string;
  windowTitle?: string;
  displayAppName?: string;
  displayWindowTitle?: string;
}

interface ConfigType {
  fontSize: number;
  defaultColors: {
    taskbar: ColorType;
    icons: ColorType;
  };
  userColors?: UserColorsType;
  userAppNamesAndWindowTitles?: Array<AppNameAndWindowTitleType>;
}

const config:ConfigType = {
  fontSize: 13,
  defaultColors: {
    taskbar: { red: 180/255, green: 180/255, blue: 180/255 },
    icons:   { red: 132/255, green: 132/255, blue: 130/255 },
  },
};

interface StateType {
  canvasesByScreenId: Map<number, hs.CanvasType>;
  doitTimer: hs.TimerType | undefined;
}

const state:StateType = {
  canvasesByScreenId: new Map<number, hs.CanvasType>(),
  doitTimer: undefined,
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

function getWindowIconColor(window: WindowInfoType): ColorType {
  const userColors = config.userColors;
  const userColorsAppNames = userColors?.appNames;

  let userColor;

  if (!userColorsAppNames || !userColorsAppNames[window.appName]) {
    return config.defaultColors.icons
  }

  userColor = userColorsAppNames[window.appName]

  if (typeof userColor === 'table') {
    return userColor
  } else {
    if (userColors.appGroups && userColors.appGroups[userColor]) {
      return userColors.appGroups[userColor];
    }
    return config.defaultColors.icons;
  }
}

function onTaskbarClick(this: void, _canvas: hs.CanvasType, _message: string, id: string | number) {
  const idAsNumber = (typeof id === 'number') ? id : parseInt(id);
  const hsWindow = hs.window.get(idAsNumber);

  // We have to check for null because it may have been closed after the most
  // recent taskbar update
  if (!hsWindow) {
    return;
  }

  if (hsWindow.isMinimized()) {
    hsWindow.unminimize();
  } else {
    hsWindow.minimize();
  }

  updateAllTaskbars();
}

function updateAllTaskbars() {
  const allWindows:WindowInfoType[] = [];
  const allScreens:ScreenInfoType[] = [];

  // Use the absence of any Hammerspoon windows (e.g. the taskbar canvases)
  // as a proxy for screen lock, screen saver, etc.
  // In these states, there are no windows reported by Hammerspoon so there's
  // no point updating anything
  let hammerspoonWindowFound = false;

  hs.window.allWindows().forEach((hammerspoonWindow) => {
    const windowInfo = getWindowInfo(hammerspoonWindow);
    allWindows.push(windowInfo);

    if (windowInfo.appName === 'Hammerspoon') {
      hammerspoonWindowFound = true;
    }
  });

  // Take into account the first render, where we won't have drawn any
  // canvases yet
  if (state.canvasesByScreenId.size > 0 && !hammerspoonWindowFound) {
    print('Hammerbar: No Hammerspoon windows. Skipping taskbar updates.')
    return;
  }

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
    const canvas = state.canvasesByScreenId.get(screen.id);
    if (!canvas) {
      print(`Hammerbar: No canvas for screen ${screen.id}`);
    } else {
      updateTaskbar(
        canvas,
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
      print(`Adding canvas for screen: ${screen.id}`);

      const canvasHeight = getCanvasHeight(config.fontSize);
      const newCanvas = hs.canvas.new({
        x: screen.x,
        y: screen.y + screen.height - canvasHeight,
        w: screen.width,
        h: canvasHeight,
      });

      newCanvas.show();
      state.canvasesByScreenId.set(screen.id, newCanvas);
      newCanvas.mouseCallback(onTaskbarClick);
    }
  });

  // Remove canvases for screens that no longer exist
  state.canvasesByScreenId.forEach((canvas, screenId) => {
    const foundScreens = allScreens.filter((screen) => screen.id === screenId);
    if (foundScreens.length === 0) {
      print(`Removing canvas for screen: ${screenId}`);
      canvas.delete();
      state.canvasesByScreenId.delete(screenId);
    }
  });
}

function updateTaskbar(
  canvas: hs.CanvasType,
  dimensions: {width: number, height: number},
  windows: Array<WindowInfoType>
) {
  const buttonHeight = getButtonHeight(config.fontSize);
  const canvasHeight = getCanvasHeight(config.fontSize);

  canvas.replaceElements(
    getTaskbarElements({
      color: config.defaultColors.taskbar,
      width: dimensions.width,
      height: dimensions.height
    })
  )

  // Use a sorted list of app names so order on the taskbar is consistent and
  // windows don't jump around
  const appNames: Array<string> = [];
  windows.forEach((window) => {
    if (!appNames.includes(window.appName)) {
      appNames.push(window.appName);
    }
  });

  appNames.sort();

  let x = BUTTON_PADDING
  let y = (canvasHeight - buttonHeight) / 2;

  appNames.forEach((appName) => {
    const windowsThisApp = windows.filter((window) => window.appName === appName);

    windowsThisApp.forEach((window) => {
      canvas.appendElements(getWindowButtonElements({
        fontSize: config.fontSize,
        x: x,
        y: y,
        window,
        getAppNameAndWindowTitle,
        getWindowIconColor,
      }));
      x += BUTTON_WIDTH + BUTTON_PADDING;
      if (x + BUTTON_WIDTH > dimensions.width) {
        x = BUTTON_PADDING;
        y += 15;
      }
    });
  });
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

function setAppNamesAndWindowTitles(appNamesAndWindowTitles: Array<AppNameAndWindowTitleType>) {
  config.userAppNamesAndWindowTitles = appNamesAndWindowTitles;
}

function setColors(colors: UserColorsType) {
  config.userColors = colors;
}

function start() {
  updateAllTaskbars();
  state.doitTimer = hs.timer.doEvery(0.5, updateAllTaskbars);
}

function stop() {
  if (state.doitTimer) {
    state.doitTimer.stop();
  }
}

const hammerbar = {
  setAppNamesAndWindowTitles,
  setColors,
  start,
  stop,
};

return hammerbar;
