// Copyright 2024, 2025 Glen Reesor
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
  type Frame = {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

//-----------------------------------------------------------------------------
declare namespace hs.application {
  interface Application {
    allWindows(): hs.window.Window[];
    bundleID(): string | null;
    name(): string;
    hide(): boolean;
    unhide(): boolean;
  }

  function find(this: void, bundleId: string): Application | null;
  function launchOrFocusByBundleID(this: void, bundleId: string): boolean;
  function runningApplications(this: void): Application[];
}

//-----------------------------------------------------------------------------

declare namespace hs.caffeinate {
  function sessionProperties(this: void): {
    // Lots of possible keys but this is the only one we care about
    CGSSessionScreenIsLocked?: boolean;
  };
}

//-----------------------------------------------------------------------------

// This should be declared like this:
//   declare namespace hs.canvas {
//     function new(args): ReturnType
//   }
//
// But `new` is a typescript keyword, so use this hack instead. TS won't
// describe `hs.canvas.new` as a function, but the actual type checking will
// be correct
declare namespace hs {
  const canvas: {
    new: (
      this: void,
      { x, y, w, h }: { x: number; y: number; w: number; h: number },
    ) => hs.canvas.Canvas;
  };
}

declare namespace hs.canvas {
  type CanvasElement = {
    center?: { x: number; y: number };
    coordinates?: { x: number; y: number }[];
    fillColor?: Color;
    frame?: { x: number; y: number; w: number; h: number };
    id?: number;
    image?: hs.image.Image;
    imageAlpha?: number;
    radius?: number;
    roundedRectRadii?: { xRadius: number; yRadius: number };
    strokeColor?: Color;
    strokeWidth?: number;
    text?: string;
    textAlignment?: 'center' | 'justified' | 'left' | 'natural' | 'right';
    textColor?: Color;
    textLineBreak?: string;
    textSize?: number;
    trackMouseDown?: boolean;
    trackMouseEnterExit?: boolean;
    trackMouseUp?: boolean;
    type: string;
  };

  type CanvasMouseCallback = (
    this: void,
    canvas: Canvas,
    message: 'mouseEnter' | 'mouseExit' | 'mouseUp',
    id: number | string,
  ) => void;

  interface Canvas {
    appendElements(element: CanvasElement | CanvasElement[]): void;
    delete(): void;
    frame: (newFrame: { x: number; y: number; w: number; h: number }) => void;
    hide(): void;
    mouseCallback(callback: CanvasMouseCallback): void;
    replaceElements(element?: CanvasElement | CanvasElement[]): void;
    show(): void;
    topLeft(point: { x: number; y: number }): Canvas;
    topLeft(): { x: number; y: number }[];
  }

  type Color = {
    red: number;
    green: number;
    blue: number;
  };
}

//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
declare namespace hs.host {
  // Yes this is the actual return type. Wow.
  type CpuUsageReturnStats = {
    user: number;
    system: number;
    nice: number;
    active: number;
    idle: number;
  }[] & {
    n: number;
    overall: {
      user: number;
      system: number;
      nice: number;
      active: number;
      idle: number;
    };
  };

  function cpuUsage(
    this: void,
    period?: number,
    callback?: (this: void, result: CpuUsageReturnStats) => void,
  ): {
    finished(): boolean;
    stop(): void;
  };

  namespace locale {
    function current(this: void): string;
    function details(
      this: void,
      identifier?: string,
    ): {
      // Lots of other keys are returned. Only listing the ones I need
      calendar: {
        AMSymbol: string;
        PMSymbol: string;
        shortMonthSymbols: string[];
        shortWeekdaySymbols: string[];
      };
      timeFormatIs24Hour: boolean;
    };
  }
}

//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
declare namespace hs.image {
  // There's other stuff on here, but this is all we care about
  interface Image {
    size: () => { w: number; h: number };
  }

  function imageFromAppBundle(this: void, bundleID: string): Image;
  function imageFromPath(this: void, path: string): Image;
}

//-----------------------------------------------------------------------------
declare namespace hs.inspect {
  function inspect(this: void, thing: any): string;
}

//-----------------------------------------------------------------------------
declare namespace hs.mouse {
  function absolutePosition(this: void): { x: number; y: number };
}

//-----------------------------------------------------------------------------
declare namespace hs.screen {
  interface Screen {
    frame(): Frame;
    id(): number;
    name(): string;
  }

  // This should be declared like this:
  //   declare namespace hs.screen.watcher {
  //     function new(args): ReturnType
  //  }
  //
  // But `new` is a typescript keyword, so use this hack instead
  type ScreenWatcher = {
    new: (
      this: void,
      watcherFn: () => void,
    ) => {
      start(): ScreenWatcher;
      stop(): ScreenWatcher;
    };
  };

  function allScreens(this: void): Screen[];
  function primaryScreen(this: void): Screen;
  const watcher: ScreenWatcher;
}

//-----------------------------------------------------------------------------
declare namespace hs.timer {
  interface Timer {
    stop(): void;
  }

  function doAfter(this: void, afterSeconds: number, callback: Function): Timer;

  function doAt(
    this: void,
    time: number | string,
    callback: Function,
    continueOnError?: boolean,
  ): Timer;

  function doAt(
    this: void,
    time: number | string,
    repeatInterval: number | string,
    callback: Function,
    continueOnError?: boolean,
  ): Timer;

  function doEvery(this: void, seconds: number, callback: Function): Timer;
}

//-----------------------------------------------------------------------------
declare namespace hs.window {
  interface Window {
    application(): hs.application.Application | null;
    focus(): void;
    frame(): hs.Frame;
    id(): number;
    isMinimized(): boolean;
    isStandard(): boolean;
    minimize(): void;
    raise(): void;
    role(): string;
    screen(): hs.screen.Screen;
    setFrame({ x, y, w, h }: hs.Frame): void;
    snapshot(): hs.image.Image | undefined;
    subrole(): string;
    title(): string;
    unminimize(): void;
  }

  function allWindows(this: void): Window[];
  function focusedWindow(this: void): Window;
  function get(this: void, windowId: number): Window | undefined;
  function orderedWindows(this: void): Window[];
}
