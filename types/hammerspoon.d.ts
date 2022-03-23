declare function print(this: void, text: string | number): void

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
    mouseCallback: (callback: CanvasMouseCallbackType) => void;
    replaceElements: (element: CanvasElementType | Array<CanvasElementType>) => void;
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

  export interface TimerType {
    stop: () => void;
  }

  interface WindowType {
    application: () => { name: () => string, bundleID: () => string };
    focus: () => void;
    id: () => number;
    isMinimized: () => boolean;
    isStandard: () => boolean;
    minimize: () => void;
    raise: () => void;
    screen: () => { id: () => number };
    title: () => string;
    unminimize: () => void;
  }

  interface CanvasNewArgs {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  // This should be a namespace in order for TS to report proper types,
  // but the required notation is `function new....` and new is a reserved
  // word in TS, thus error :-(
  export const canvas: {
    new: (this: void, {x, y, w, h}: CanvasNewArgs) => CanvasType;
  }

  namespace eventtap {
    function checkKeyboardModifiers(this: void): {shift?: boolean, cmd?: boolean};
  }

  namespace image {
    function imageFromAppBundle(this: void, bundleID: string): Object;
  }

  namespace screen {
    function allScreens(this: void): Array<ScreenType>;
  }

  namespace timer {
    function doEvery(this: void, seconds: number, callback: Function): TimerType;
  }

  namespace window {
    function allWindows(this: void ): Array<WindowType>;
    function get(this: void, windowId: number): WindowType | undefined;
  }
}
