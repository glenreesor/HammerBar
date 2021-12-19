declare function print(this: void, text: string | number): void

declare namespace hs {
  interface CanvasMouseCallbackType {
    (this: void, canvas: CanvasType, message: string, id: number | string): void;
  }

  interface CanvasType {
    appendElements: (element: any | Array<any>) => void;
    delete: () => void;
    mouseCallback: (callback: CanvasMouseCallbackType) => void;
    replaceElements: (element: any | Array<any>) => void;
    show: () => void;
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
    application: () => { name: () => string };
    id: () => number;
    isMinimized: () => boolean;
    isStandard: () => boolean;
    minimize: () => void;
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

  export const canvas: {
    new: (this: void, {x, y, w, h}: CanvasNewArgs) => CanvasType;
  }

  export const screen: {
    allScreens: (this: void) => Array<ScreenType>;
  };

  export const timer: {
    doEvery: (this: void, seconds: number, callback: Function) => TimerType;
  };

  export const window: {
    allWindows: (this: void ) => Array<WindowType>;
    get: (this: void, windowId: number) => WindowType | undefined;
  }
}
