declare namespace hs {
  interface CanvasElementType {
    type: string;
    id?: number;
    fillColor?: ColorType;
    frame?: { x: number, y: number, w: number, h: number };
    image?: any;
    imageAlpha?: number;
    roundedRectRadii?: {xRadius: number, yRadius: number };
    strokeColor?: ColorType;
    text?: string;
    textColor?: ColorType;
    textLineBreak?: string;
    textSize?: number;
    trackMouseUp?: boolean;
  }

  interface CanvasMouseCallbackType {
    (this: void, canvas: CanvasType, message: string, id: number | string): void;
  }

  interface CanvasType {
    appendElements: (element: CanvasElementType | Array<CanvasElementType>) => void;
    delete: () => void;
    hide: () => void;
    mouseCallback: (callback: CanvasMouseCallbackType) => void;
    replaceElements: (element?: CanvasElementType | Array<CanvasElementType>) => void;
    show: () => void;
  }

  interface ColorType {
    red: number;
    green: number;
    blue: number;
  }

  interface ScreenType {
    frame: () => {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    id: () => number;
    name: () => string;
  }

  interface TimerType {
    stop: () => void;
  }

  interface WindowType {
    application: () => {
      name: () => string,
      bundleID: () => string | null,
    };
    focus: () => void;
    id: () => number;
    isMinimized: () => boolean;
    isStandard: () => boolean;
    minimize: () => void;
    raise: () => void;
    role: () => string;
    screen: () => { id: () => number };
    title: () => string;
    unminimize: () => void;
  }

  // We need to use this interface approach (instead of just namespacing like
  // below) due to `new` being a TS reserved word
  interface WindowDotCanvas {
    new: (
      this: void,
      {x, y, w, h}: {x: number, y: number, w: number, h: number}
    ) => CanvasType;
  }

  interface WindowFilter {
    getWindows: () => Array<WindowType>;
    new: (
      this: void,
      filterCriteria: null | boolean | ((this:void, hsWindow: WindowType) => boolean),
    ) => WindowFilter;
    subscribe: (events: Array<string>, callback: Function) => void;
    unsubscribeAll: () => void;
    windowAllowed: string;
    windowCreated: string;
    windowDestroyed: string;
    windowFocused: string;
    windowFullscreened: string;
    windowHidden: string;
    windowInCurrentSpace: string;
    windowMinimized: string;
    windowMoved: string;
    windowNotInCurrentSpace: string;
    windowNotOnScreen: string;
    windowNotVisible: string;
    windowOnScreen: string;
    windowRejected: string;
    windowsChanged: string;
    windowTitleChanged: string;
    windowUnfocused: string;
    windowUnfullscreened: string;
    windowUnhidden: string;
    windowUnminimized: string;
    windowVisible: string;
  }

  namespace application {
    function launchOrFocusByBundleID(this: void, name: string): boolean;
  }

  export const canvas: WindowDotCanvas;

  namespace eventtap {
    function checkKeyboardModifiers(this: void): {
      alt?: boolean,
      capslock?: boolean,
      cmd?: boolean,
      ctrl?: boolean,
      fn?: boolean,
      shift?: boolean,
    };
  }

  namespace hotkey {
    // There are a bazillion overrides that hammerspoon accepts. Just create
    // the one I need
    function bind(this: void, mods: string, key: string, pressedFunction: () => void): void;
  }

  namespace image {
    function imageFromAppBundle(this: void, bundleID: string): Object;
    function imageFromPath(this: void, path: string): Object;
  }

  namespace inspect {
    function inspect(this: void, thing: any): string;
  }

  namespace screen {
    function allScreens(this: void): Array<ScreenType>;
  }

  namespace timer {
    function doEvery(this: void, seconds: number, callback: Function): TimerType;
  }

  namespace window {
    function allWindows(this: void): Array<WindowType>;
    function focusedWindow(this: void): WindowType;
    function get(this: void, windowId: number): WindowType | undefined;
    const filter: WindowFilter;
  }
}
