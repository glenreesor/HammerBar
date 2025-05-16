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

// This should be declared like this:
//   declare namespace hs.canvas {
//     function new(args): ReturnType
//   }
//
// But `new` is a typescript keyword, so use this hack instead. TS won't
// describe `hs.canvas.new` as a function, but the actual type checking will
// be correct

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

  function new_(
    this: void,
    { x, y, w, h }: { x: number; y: number; w: number; h: number },
  ): Canvas;

  export { Canvas, CanvasElement, CanvasMouseCallback, Color, new_ as new };
}
