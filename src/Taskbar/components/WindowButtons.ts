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

import { BLACK, WHITE } from 'src/constants';
import { WindowInfoType } from 'src/hammerspoonUtils/getWindowInfo';

interface ConstructorType {
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;
  backgroundColor: hs.ColorType;
  fontSize: number;
  onWindowButtonClick: (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;
}

const MAX_BUTTON_WIDTH = 130;

export default class WindowButtons {
  _HORIZONTAL_PADDING = 4;
  _VERTICAL_PADDING = 4;

  _canvas: hs.CanvasType;
  _width: number;
  _height: number;
  _backgroundColor: hs.ColorType;
  _fontSize: number;

  constructor({
    topLeftX,
    topLeftY,
    width,
    height,
    backgroundColor,
    fontSize,
    onWindowButtonClick,
  }: ConstructorType) {
    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });
    this._canvas.mouseCallback(onWindowButtonClick);

    this._width = width;
    this._height = height;
    this._backgroundColor = backgroundColor;
    this._fontSize = fontSize;

    this.update(true, []);
  }

  update(taskbarIsVisible: boolean, windows: Array<WindowInfoType>) {
    if (taskbarIsVisible) {
      this._canvas.show();

      this._canvas.replaceElements();
      this._addBackgroundElement();
      this._addWindowsElements(windows);
    } else {
      this._canvas.hide();
    }
  }

  _addBackgroundElement(): void {
    this._canvas.appendElements({
      type: 'rectangle',
      fillColor: this._backgroundColor,
      frame: { x: 0, y: 0, w: this._width, h: this._height},
    });
  }

  _addWindowsElements(windows: Array<WindowInfoType>): void {
    const buttonHeight = this._height - 2 * this._VERTICAL_PADDING;

    this._orderWindowsConsistently(windows);

    const buttonWidth = this._getButtonWidth(windows.length);

    let x = this._HORIZONTAL_PADDING;

    windows.forEach((window) => {
      this._canvas.appendElements(
        this._getWindowButtonElements(x, this._VERTICAL_PADDING, buttonWidth, buttonHeight, window)
      );
      x += buttonWidth + this._HORIZONTAL_PADDING;
    });
  }

  _getButtonWidth(numberOfButtons: number): number {
    // Think of this as:
    //  - we need to account for the padding before each button
    //    (numberOfButtons * this._HORIZONTAL_PADDING)
    //  - and we need to account for the padding after the last button
    //    ( - this._HORIZONTAL_PADDING)
    const widthToFillTaskbar = (
      this._width - numberOfButtons * this._HORIZONTAL_PADDING - this._HORIZONTAL_PADDING
    ) / numberOfButtons;

    // Now adjust because we don't want gigantic buttons
    const buttonWidth = Math.min(MAX_BUTTON_WIDTH, widthToFillTaskbar);

    return buttonWidth;
  }

  _getWindowButtonElements(
    x: number,
    y: number,
    buttonWidth: number,
    buttonHeight: number,
    window: WindowInfoType
  ): Array<hs.CanvasElementType> {
    const MINIMIZED_BACKGROUND_COLOR = { red: 190/255, green: 190/255, blue: 190/255 };

    const APP_ICON_PADDING_LEFT = 2;

    const TEXT_PADDING_LEFT = 0;
    const TEXT_PADDING_RIGHT = 3;

    const appIconWidth = buttonHeight;
    const appIconHeight = appIconWidth;
    const appIconX = x + APP_ICON_PADDING_LEFT;
    const appIconY = y;

    const textX = appIconX + appIconWidth + TEXT_PADDING_LEFT;
    const textY = y;
    const maxTextWidth = (
      buttonWidth -
      APP_ICON_PADDING_LEFT -
      appIconWidth -
      TEXT_PADDING_LEFT -
      TEXT_PADDING_RIGHT
    );

    const appIcon = hs.image.imageFromAppBundle(window.bundleId);
    const appIconAlpha = window.isMinimized ? 0.6 : 1;

    const clickId = window.id;

    return [
      {
        // Container
        type: 'rectangle',
        fillColor: window.isMinimized ? MINIMIZED_BACKGROUND_COLOR : WHITE,
        frame: {
          x: x,
          y: y,
          w: buttonWidth,
          h: buttonHeight,
        },
        roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
        trackMouseUp: true,
        id: clickId,
      }, {
        // App icon
        type: 'image',
        frame: {
          x: appIconX,
          y: appIconY,
          w: appIconWidth,
          h: appIconHeight,
        },
        image: appIcon,
        imageAlpha: appIconAlpha,
        trackMouseUp: true,
        id: clickId,
      },
      {
        // Text: window title
        type: 'text',
        text: window.windowTitle,
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: textX,
          y: textY,
          w: maxTextWidth,
          h: buttonHeight
        },
        trackMouseUp: true,
        id: clickId,
      },
    ];
  }

  /**
   * Modify the specified array of windows so they will be ordered consistently
   * every render, independent of the order that Hammerspoon provides them, so
   * the window buttons won't change positions on different renders
   */
  _orderWindowsConsistently(windows: WindowInfoType[]): void {
    // Sort by appname so window buttons are grouped by app, and then by
    // window ID within app
    windows.sort((window1, window2) => {
      if (window1.appName < window2.appName) {
        return -1;
      }

      if (window1.appName === window2.appName) {
        if (window1.id < window2.id) {
          return -1;
        }

        if (window1.id === window2.id) {
          // Presumably this will never happen
          return 0;
        }
      }

      return 1;
    });
  }
}
