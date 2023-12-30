// Copyright 2023 Glen Reesor
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

export default class Panel {
  _canvas: hs.CanvasType;
  _height: number;
  _width: number;

  constructor(
    { x, y, width, height, color }:
    { x: number, y: number, width: number, height: number, color: hs.ColorType }
  ) {
    this._height = height;
    this._width = width;
    this._canvas = hs.canvas.new({ x, y, w: width, h: height });
    this._canvas.replaceElements([
      {
        type: 'rectangle',
        fillColor: color,
        frame: {
          x: 0,
          y: 0,
          w: this._width,
          h: this._height,
        },
      },
    ]);
    this._canvas.show();
  }
}
