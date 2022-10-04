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
 * An object that renders a canvas with a digital clock
 */
export default class Clock {
  _backgroundColor: hs.ColorType;
  _canvas: hs.CanvasType;
  _fontSize: number;
  _height: number;
  _width: number;

  /**
   * Create a canvas that renders a digital clock with the current time.
   * Calling code must call the update() method in order to update the rendered
   * time.
   *
   * @param fontSize
   * @param topLeftX The x-coordinate of the top left of the canvas
   * @param topLeftY The y-coordinate of the top left of the canvas
   * @param width
   * @param height
   * @param backgroundColor
   */
  constructor({ fontSize, topLeftX, topLeftY, width, height, backgroundColor }: {
    fontSize: number;
    topLeftX: number;
    topLeftY: number;
    width: number;
    height: number;
    backgroundColor: hs.ColorType;
  }) {
    this._fontSize = fontSize;
    this._width = width;
    this._height = height;
    this._backgroundColor = backgroundColor;

    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });

    this.update(true);
  }

  hide() {
    this._canvas.hide();
  }

  update(taskbarIsVisible: boolean) {
    if (taskbarIsVisible) {
      this._canvas.show();
      this._canvas.replaceElements(this._getCanvasElements());
    } else {
      this._canvas.hide();
    }
  }

  /**
   * Get all the canvas elements required to render a clock with the current time
   */
  _getCanvasElements(): Array<hs.CanvasElementType> {
    const { formattedTime, formattedDate } = this._getFormattedDateTime();

    const timeY = this._height / 2 - this._fontSize - this._fontSize / 2;
    const dateY = timeY + this._fontSize * 1.6;

    return [
      {
        type: 'rectangle',
        fillColor: this._backgroundColor,
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
        text: formattedTime,
        textAlignment: 'center',
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: 0,
          y: timeY,
          w: this._width,
          h: this._fontSize * 1.2,
        },
      },
      {
        type: 'text',
        text: formattedDate,
        textAlignment: 'center',
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: 0,
          y: dateY,
          w: this._width,
          h: this._fontSize * 1.2,
        },
      },
    ] as Array<hs.CanvasElementType>;
  }

  _getFormattedDateTime(): { formattedTime: string, formattedDate: string } {
    const now = os.date('*t') as os.DateTable;

    const hour = now.hour < 13 ? now.hour : now.hour - 12;
    const minute = `${now.min < 10 ? '0' : ''}${now.min}`;
    const ampm = now.hour < 12 ? 'am' : 'pm';

    const year = now.year;
    const month = `${now.month < 10 ? '0' : ''}${now.month}`;
    const day = `${now.day < 10 ? '0' : ''}${now.day}`;

    return {
      formattedTime: `${hour}:${minute} ${ampm}`,
      formattedDate: `${year}-${month}-${day}`,
    };
  }
}
