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

declare namespace hs {
  type Application = {
    allWindows: () => WindowType[];
    hide: () => boolean;
    unhide: () => boolean;
  };

  type CanvasElementType = {
    center?: { x: number; y: number };
    coordinates?: { x: number; y: number }[];
    fillColor?: ColorType;
    frame?: { x: number; y: number; w: number; h: number };
    id?: number;
    image?: ImageType;
    imageAlpha?: number;
    radius?: number;
    roundedRectRadii?: { xRadius: number; yRadius: number };
    strokeColor?: ColorType;
    strokeWidth?: number;
    text?: string;
    textAlignment?: 'center' | 'justified' | 'left' | 'natural' | 'right';
    textColor?: ColorType;
    textLineBreak?: string;
    textSize?: number;
    trackMouseDown?: boolean;
    trackMouseEnterExit?: boolean;
    trackMouseUp?: boolean;
    type: string;
  };

  type CanvasMouseCallbackType = {
    (
      this: void,
      canvas: CanvasType,
      message: 'mouseEnter' | 'mouseExit' | 'mouseUp',
      id: number | string,
    ): void;
  };

  type CanvasType = {
    appendElements: (element: CanvasElementType | CanvasElementType[]) => void;
    delete: () => void;
    frame: (newFrame: { x: number; y: number; w: number; h: number }) => void;
    hide: () => void;
    mouseCallback: (callback: CanvasMouseCallbackType) => void;
    replaceElements: (
      element?: CanvasElementType | CanvasElementType[],
    ) => void;
    show: () => void;
    topLeft:
      | ((point: { x: number; y: number }) => CanvasType)
      | (() => { x: number; y: number }[]);
  };

  type ColorType = {
    red: number;
    green: number;
    blue: number;
  };

  type FrameType = {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  function inspect(this: void, thingToInspect: any): string;

  type ImageType = Object;

  type ScreenType = {
    frame: () => FrameType;
    id: () => number;
    name: () => string;
  };

  type ScreenWatcher = {
    new: (
      this: void,
      watcherFn: () => void,
    ) => {
      start: () => ScreenWatcher;
      stop: () => ScreenWatcher;
    };
  };

  type TimerType = {
    stop: () => void;
  };

  type WindowFilter = {
    getWindows: () => WindowType[];
    new: (
      this: void,
      filterCriteria:
        | null
        | boolean
        | ((this: void, hsWindow: WindowType) => boolean),
    ) => WindowFilter;
    subscribe: (events: string[], callback: Function) => void;
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
  };

  type WindowType = {
    application: () => {
      name: () => string;
      bundleID: () => string | null;
    } | null;
    focus: () => void;
    frame: () => FrameType;
    id: () => number;
    isMinimized: () => boolean;
    isStandard: () => boolean;
    minimize: () => void;
    raise: () => void;
    role: () => string;
    screen: () => ScreenType;
    setFrame: ({ x, y, w, h }: FrameType) => void;
    subrole: () => string;
    title: () => string;
    unminimize: () => void;
  };

  // This should be declared using a namespace:
  //     declare namespace hs.canvas {
  //       new: (
  //         this: void,
  //         { x, y, w, h }: { x: number; y: number; w: number; h: number },
  //       ) => CanvasType;
  //     }
  //
  // But that won't work since `new` is a typescript keyword, hence the following
  // interface hack
  interface HsDotCanvas {
    new: (
      this: void,
      { x, y, w, h }: { x: number; y: number; w: number; h: number },
    ) => CanvasType;
  }
  const canvas: HsDotCanvas;
}

declare namespace hs.application {
  function find(this: void, bundleId: string): Application;
  function launchOrFocusByBundleID(this: void, name: string): boolean;
}

declare namespace hs.eventtap {
  function checkKeyboardModifiers(this: void): {
    alt?: boolean;
    capslock?: boolean;
    cmd?: boolean;
    ctrl?: boolean;
    fn?: boolean;
    shift?: boolean;
  };
}

declare namespace hs.hotkey {
  // There are a bazillion overrides that hammerspoon accepts. Just create
  // the one I need
  function bind(
    this: void,
    mods: string,
    key: string,
    pressedFunction: () => void,
  ): void;
}

declare namespace hs.image {
  function imageFromAppBundle(this: void, bundleID: string): ImageType;
  function imageFromPath(this: void, path: string): ImageType;
}

declare namespace hs.inspect {
  function inspect(this: void, thing: any): string;
}

declare namespace hs.mouse {
  function absolutePosition(this: void): { x: number; y: number };
}

declare namespace hs.screen {
  function allScreens(this: void): ScreenType[];
  function primaryScreen(this: void): ScreenType;
  const watcher: ScreenWatcher;
}

declare namespace hs.timer {
  function doAfter(
    this: void,
    afterSeconds: number,
    callback: Function,
  ): TimerType;

  function doAt(
    this: void,
    time: number | string,
    callback: Function,
    continueOnError?: boolean,
  ): TimerType;

  function doAt(
    this: void,
    time: number | string,
    repeatInterval: number | string,
    callback: Function,
    continueOnError?: boolean,
  ): TimerType;

  function doEvery(this: void, seconds: number, callback: Function): TimerType;
}

declare namespace hs.window {
  function allWindows(this: void): WindowType[];
  function focusedWindow(this: void): WindowType;
  function get(this: void, windowId: number): WindowType | undefined;
  function orderedWindows(this: void): WindowType[];
  const filter: WindowFilter;
}
