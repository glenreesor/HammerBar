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
  interface Application {
    allWindows: () => WindowType[];
    hide: () => boolean;
    unhide: () => boolean;
  }

  interface CanvasElementType {
    center?: { x: number; y: number };
    coordinates?: { x: number; y: number }[];
    fillColor?: ColorType;
    frame?: { x: number; y: number; w: number; h: number };
    id?: number;
    image?: any;
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
  }

  interface CanvasMouseCallbackType {
    (
      this: void,
      canvas: CanvasType,
      message: 'mouseEnter' | 'mouseExit' | 'mouseUp',
      id: number | string,
    ): void;
  }

  interface CanvasType {
    appendElements: (
      element: CanvasElementType | Array<CanvasElementType>,
    ) => void;
    delete: () => void;
    frame: (newFrame: { x: number; y: number; w: number; h: number }) => void;
    hide: () => void;
    mouseCallback: (callback: CanvasMouseCallbackType) => void;
    replaceElements: (
      element?: CanvasElementType | Array<CanvasElementType>,
    ) => void;
    show: () => void;
    topLeft:
      | ((point: { x: number; y: number }) => CanvasType)
      | (() => { x: number; y: number }[]);
  }

  interface ColorType {
    red: number;
    green: number;
    blue: number;
  }

  interface FrameType {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  interface ScreenType {
    frame: () => FrameType;
    id: () => number;
    name: () => string;
  }

  interface TimerType {
    stop: () => void;
  }

  interface WindowType {
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
    title: () => string;
    unminimize: () => void;
  }

  // We need to use this interface approach (instead of just namespacing like
  // below) due to `new` being a TS reserved word
  interface WindowDotCanvas {
    new: (
      this: void,
      { x, y, w, h }: { x: number; y: number; w: number; h: number },
    ) => CanvasType;
  }

  interface WindowFilter {
    getWindows: () => Array<WindowType>;
    new: (
      this: void,
      filterCriteria:
        | null
        | boolean
        | ((this: void, hsWindow: WindowType) => boolean),
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

  interface ScreenWatcher {
    new: (
      this: void,
      watcherFn: () => void,
    ) => {
      start: () => ScreenWatcher;
      stop: () => ScreenWatcher;
    };
  }

  namespace application {
    function find(this: void, bundleId: string): Application;
    function launchOrFocusByBundleID(this: void, name: string): boolean;
  }

  export const canvas: WindowDotCanvas;

  namespace eventtap {
    function checkKeyboardModifiers(this: void): {
      alt?: boolean;
      capslock?: boolean;
      cmd?: boolean;
      ctrl?: boolean;
      fn?: boolean;
      shift?: boolean;
    };
  }

  namespace hotkey {
    // There are a bazillion overrides that hammerspoon accepts. Just create
    // the one I need
    function bind(
      this: void,
      mods: string,
      key: string,
      pressedFunction: () => void,
    ): void;
  }

  namespace image {
    function imageFromAppBundle(this: void, bundleID: string): Object;
    function imageFromPath(this: void, path: string): Object;
  }

  namespace inspect {
    function inspect(this: void, thing: any): string;
  }

  namespace mouse {
    function absolutePosition(this: void): { x: number; y: number };
  }

  namespace screen {
    function allScreens(this: void): Array<ScreenType>;
    function primaryScreen(this: void): ScreenType;
    const watcher: ScreenWatcher;
  }

  namespace timer {
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

    function doEvery(
      this: void,
      seconds: number,
      callback: Function,
    ): TimerType;
  }

  namespace window {
    function allWindows(this: void): Array<WindowType>;
    function focusedWindow(this: void): WindowType;
    function get(this: void, windowId: number): WindowType | undefined;
    function orderedWindows(this: void): WindowType[];
    const filter: WindowFilter;
  }
}
