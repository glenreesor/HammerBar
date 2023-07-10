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

import { LauncherConfigType } from 'src/types';
import AppMenu from 'src/AppMenu';

const BACKGROUND_COLOR = { red: 100/255, green: 100/255, blue: 100/255 };
const IMAGE_PADDING = 2;

/**
 * An object that renders a canvas containing a button intended to launch
 * something like an app or an app menu
 */
export default class LauncherButton {
  _appMenu: AppMenu | undefined;
  _canvas: hs.CanvasType;
  _fontSize: number;
  _launcherConfig: LauncherConfigType;
  _topLeftX: number;
  _topLeftY: number;
  _launchAppWithOptionalHack: (this: void, bundleId: string) => void;

  /**
   * Create a canvas to hold a button for launching things
   *
   * @param args.topLeftX
   * @param args.topLeftY
   * @param args.width
   * @param args.height
   * @param args.fontSize
   * @param args.launcherDetails An object that describes what should happen when
   *                             this button is clicked
   */
  constructor(args: {
    topLeftX: number,
    topLeftY: number,
    width: number,
    height: number,
    fontSize: number,
    launcherDetails: LauncherConfigType,
    launchAppWithOptionalHack: (this: void, bundleId: string) => void,
  }) {
    const {
      topLeftX,
      topLeftY,
      width,
      height,
      fontSize,
      launcherDetails,
      launchAppWithOptionalHack
    } = args;

    this._fontSize = fontSize;
    this._launcherConfig = launcherDetails;
    this._launchAppWithOptionalHack = launchAppWithOptionalHack;
    this._topLeftX = topLeftX;
    this._topLeftY = topLeftY;

    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });

    const image = launcherDetails.type === 'app'
      ? hs.image.imageFromAppBundle(launcherDetails.bundleId)
      : hs.image.imageFromPath(
        os.getenv('HOME') + '/.hammerspoon/Spoons/HammerBar.spoon/appMenuButton.png'
      );

    const imageWidth = width - 2 * IMAGE_PADDING;

    this._canvas.appendElements(
      [
        {
          type: 'rectangle',
          fillColor: BACKGROUND_COLOR,
          frame: {
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
          trackMouseUp: true,
        },
        {
          type: 'image',
          frame: {
            x: IMAGE_PADDING,
            y: (height - imageWidth) / 2,
            w: imageWidth,
            h: imageWidth,
          },
          image: image,
        },
      ]
    );

    this._canvas.mouseCallback(() => this._onClick());
    this._canvas.show();
  }

  /**
   * Update the visibility of this button's canvas
   */
  update(isVisible: boolean) {
    if (isVisible) {
      this._canvas.show();
    } else {
      this._canvas.hide();
    }
  }

  /**
   * Handle clicking on this button -- either launch the corresponding app
   * or show the corresponding app menu
   */
  _onClick() {
    if (this._launcherConfig.type === 'app') {
      this._launchAppWithOptionalHack(this._launcherConfig.bundleId);
    } else {
      if (!this._appMenu) {
        this._appMenu = new AppMenu({
          bottomLeftX: this._topLeftX,
          bottomLeftY: this._topLeftY - 1,
          fontSize: this._fontSize,
          appList: this._launcherConfig.apps,
          launchAppWithOptionalHack: this._launchAppWithOptionalHack,
        });
      } else {
        this._appMenu.toggleVisibility();
      }
    }
  }
}

