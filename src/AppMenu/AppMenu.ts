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

import { BLACK, WHITE } from 'src/constants';
import { MenuAppType } from 'src/Taskbar';

const MENU_WIDTH = 120;

const HEIGHT_PER_APP = 30;
const VERTICAL_PADDING_TOP = 4;
const VERTICAL_PADDING_BOTTOM = 4;
const VERTICAL_PADDING_BETWEEN_APPS = 4;

/**
 * An object that renders a canvas with a list of clickable app buttons.
 * Clicking an app button launches the app and hides this AppMenu's canvas.
 * If Command or Control is pressed while clicking, this AppMenu's canvas will
 * not be hidden.
 */
export default class AppMenu {
  _canvas: hs.CanvasType;
  _iAmVisible: boolean;
  _appList: MenuAppType[];
  _launchAppWithOptionalHack: (this: void, bundleId: string) => void;

  /**
   * Create a visible canvas that renders a vertical list of clickable app
   * buttons
   *
   * @param args.bottomLeftX The x-coordinate of the bottom left of the entire menu
   * @param args.bottomLeftY The y-coordinate of the bottom left of the entire menu
   * @param args.fontSize
   * @param args.appList     An array of objects that each describe an app button to render
   */
  constructor(args: {
    bottomLeftX: number,
    bottomLeftY: number,
    fontSize: number,
    appList: MenuAppType[],
    launchAppWithOptionalHack: (this: void, bundleId: string) => void,
  }) {
    const {
      bottomLeftX,
      bottomLeftY,
      fontSize,
      appList,
      launchAppWithOptionalHack
    } = args;

    this._appList = appList;
    this._launchAppWithOptionalHack = launchAppWithOptionalHack;

    const height = appList.length * HEIGHT_PER_APP +
      VERTICAL_PADDING_TOP +
      (appList.length - 1) * VERTICAL_PADDING_BETWEEN_APPS +
      VERTICAL_PADDING_BOTTOM;

    this._canvas = hs.canvas.new({
      x: bottomLeftX,
      y: bottomLeftY - height,
      w: MENU_WIDTH,
      h: height,
    });

    this._canvas.appendElements({
      type: 'rectangle',
      fillColor: WHITE,
      frame: {
        x: 0,
        y: 0,
        w: MENU_WIDTH,
        h: height,
      }
    });

    this._addApps(fontSize, appList);
    this._canvas.mouseCallback(
      (
        canvas: hs.CanvasType,
        message: string,
        id: number | string
      ) => this._onAppClick(canvas, message, id)
    );
    this._canvas.show();
    this._iAmVisible = true;
  }

  toggleVisibility() {
    if (this._iAmVisible) {
      this._hide();
    } else {
      this._show();
    }
  }

  _hide() {
    this._canvas.hide();
    this._iAmVisible = false;
  }

  _show() {
    this._canvas.show();
    this._iAmVisible = true;
  }

  /**
   * Add canvas elements required to render all apps in this menu
   */
  _addApps(fontSize: number, appList: MenuAppType[]) {
    const HORIZONTAL_PADDING = 4;
    let y = VERTICAL_PADDING_TOP;

    appList.forEach((app, index) => {
      this._canvas.appendElements(
        this._getOneAppElements(
          HORIZONTAL_PADDING,
          y,
          HEIGHT_PER_APP,
          MENU_WIDTH - 2 * HORIZONTAL_PADDING,
          fontSize,
          app,
          index
        )
      );
      y += HEIGHT_PER_APP + VERTICAL_PADDING_BETWEEN_APPS;
    });
  }

  /**
   * Return the canvas elements required for one app button
   *
   * @param x      The x-coordinate of the top left corner of the button
   * @param y      The y-coordinate of the top left corner of the button
   * @param height The required button height
   * @param width  The required button width
   * @param fontSize
   * @param app    An object that describes the app name and icon
   * @param appId  An ID to associate with the button (which will be used by
   *               the click handler
   */
  _getOneAppElements(
    x: number,
    y: number,
    height: number,
    width: number,
    fontSize: number,
    app: MenuAppType,
    appId: number,
  ):hs.CanvasElementType[] {
    const APP_ICON_PADDING_LEFT = 2;

    const TEXT_PADDING_LEFT = 0;
    const TEXT_PADDING_RIGHT = 5;

    const appIconWidth = height;
    const appIconHeight = appIconWidth;
    const appIconX = x + APP_ICON_PADDING_LEFT;
    const appIconY = y;

    const textX = appIconX + appIconWidth + TEXT_PADDING_LEFT;

    // We're only expecting one line of text, so center it on the icon
    const textY = appIconY + appIconHeight / 2 - 1.4 * fontSize / 2;

    const maxTextWidth = (
      width -
      APP_ICON_PADDING_LEFT -
      appIconWidth -
      TEXT_PADDING_LEFT -
      TEXT_PADDING_RIGHT
    );

    return [
      {
        type: 'rectangle',
        fillColor: { red: 0.8, green: 0.8, blue: 0.8 },
        frame: {
          x: x,
          y: y,
          w: width,
          h: height,
        },
        roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      },
      {
        type: 'image',
        frame: {
          x: appIconX,
          y: appIconY,
          w: appIconWidth,
          h: appIconHeight,
        },
        image: hs.image.imageFromAppBundle(app.bundleId),
        trackMouseUp: true,
        id: appId,
      },
      {
        type: 'text',
        text: app.displayName,
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: textX,
          y: textY,
          w: maxTextWidth,
          h: height,
        },
        trackMouseUp: true,
        id: appId,
      },
    ];
  }

  /**
   * Handle clicks on an app button.
   *
   * This will launch the specified app and hide this menu.
   * If Command or Control is pressed at the same time, this menu will remain
   * visible.
   *
   * @param _canvas  Unused
   * @param _message Unused
   * @param id       The ID that was in the canvas element. We're expecting
   *                 this to be the index into our array of apps
   */
  _onAppClick(_canvas: hs.CanvasType, _message: string, id: number | string) {
    const idAsNumber = (typeof id === 'number') ? id : parseInt(id);
    const keyboardModifiers = hs.eventtap.checkKeyboardModifiers();

    this._launchAppWithOptionalHack(this._appList[idAsNumber].bundleId);
    if (!keyboardModifiers.cmd && !keyboardModifiers.ctrl) {
      this._hide();
    }
  }
}
