// Copyright 2022 Glen Reesor
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

import { BLACK } from 'src/constants';

/**
 * An object that renders a canvas containing a button on either the left or
 * right side of the screen. It is intended that this button toggles the taskbar
 * (handled by a click handler).
 */
export default class ToggleButton {
  _fontSize: number;
  _canvas: hs.CanvasType;
  _screenSide: 'left' | 'right';
  _width: number;
  _height: number;

  /**
   * Create a button for toggling the taskbar
   *
   * @param fontSize Seems weird, right? It's because we use `<` or `>` in the button
   * @param screenSide
   * @param height   Button height
   * @param width    Button Width
   * @param topLeftX The x-coordinate of the top left of the button
   * @param topLeftY The y-coordinate of the top left of the button
   * @param onClick  The function to call when this button is clicked
   *                 (this component doesn't directly hide the taskbar)
   */
  constructor(args:
  {
    fontSize: number,
    screenSide: 'left' | 'right',
    height: number,
    width: number,
    topLeftX: number,
    topLeftY: number,
    onClick: (this: void) => void,
  }) {
    const { fontSize, screenSide, width, height, topLeftX, topLeftY, onClick } = args;

    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });
    this._canvas.mouseCallback(onClick);

    this._fontSize = fontSize;
    this._screenSide = screenSide;
    this._width = width;
    this._height = height;

    this.update(true);
  }

  /**
   * Hide this ToggleButton
   */
  hide() {
    this._canvas.hide();
  }

  /**
   * Update the contents of this ToggleButton based on whether the taskbar is
   * visible or not
   */
  update(taskbarIsVisible: boolean) {
    let toggleSymbol;

    if (this._screenSide === 'left') {
      toggleSymbol = taskbarIsVisible ? '<' : '>';
    } else {
      toggleSymbol = taskbarIsVisible ? '>' : '<';
    }

    this._canvas.replaceElements(this._getCanvasElements(toggleSymbol));
    this._canvas.show();
  }

  /**
   * Get the canvas elements required to render this ToggleButton
   */
  _getCanvasElements(toggleSymbol: string): hs.CanvasElementType[] {
    return [
      {
        type: 'rectangle',
        fillColor: { red: 100/255, green: 100/255, blue: 100/255 },
        frame: {
          x: 0,
          y: 0,
          w: this._width,
          h: this._height,
        },
        trackMouseUp: true,
      },
      {
        type: 'text',
        text: toggleSymbol,
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: this._width / 4,
          y: this._height / 2 - this._fontSize / 2,
          w: this._fontSize,
          h: this._fontSize * 1.2,
        },
        trackMouseUp: true,
      },
    ];
  }
}
