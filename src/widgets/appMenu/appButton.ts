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

import { BLACK } from 'src/constants';
import type { WidgetBuilderParams } from 'src/Panel';

export function getAppButton(
  {
    x,
    y,
    height,
    panelColor,
    panelHoverColor,
    bundleId,
    label,
    onClick, }: WidgetBuilderParams & { bundleId: string, label: string, onClick: () => void }
) {
  function destroy() {
    canvas.delete();
  }

  const mouseCallback: hs.CanvasMouseCallbackType = function(
    this: void,
    _canvas: hs.CanvasType,
    msg: 'mouseEnter' | 'mouseExit' | 'mouseDown' | 'mouseUp',
  ) {
    if (msg === 'mouseEnter') {
      state.mouseIsInsideButton = true;
      render();
    } else if (msg === 'mouseExit') {
      state.mouseIsInsideButton = false;
      state.mouseButtonIsDown = false;
      render();
    } else if (msg === 'mouseDown') {
      state.mouseButtonIsDown = true;
      render();
    } else if (msg === 'mouseUp') {
      state.mouseButtonIsDown = false;
      render();
      onClick();
    }
  }

  function render() {
    // const IMAGE_PADDING = 2;
    // const normalImageWidth = width - 2 * IMAGE_PADDING;

    const bgColor = state.mouseIsInsideButton
      ? panelHoverColor
      : panelColor;

    // const imageWidth = state.mouseButtonIsDown
    //   ? 0.8 * normalImageWidth
    //   : normalImageWidth;

    // const imageX = state.mouseButtonIsDown
    //   ? IMAGE_PADDING + 0.1 * normalImageWidth
    //   : IMAGE_PADDING;
      //
    const APP_ICON_PADDING_LEFT = 2;

    const TEXT_PADDING_LEFT = 0;
    const TEXT_PADDING_RIGHT = 5;

    const appIconWidth = height;
    const appIconHeight = appIconWidth;
    const appIconX = APP_ICON_PADDING_LEFT;
    const appIconY = 0;

    const textX = appIconX + appIconWidth + TEXT_PADDING_LEFT;

    // We're only expecting one line of text, so center it on the icon
    const fontSize = 12;
    const textY = appIconY + appIconHeight / 2 - 1.4 * fontSize / 2;

    const maxTextWidth = (
      CANVAS_WIDTH -
      APP_ICON_PADDING_LEFT -
      appIconWidth -
      TEXT_PADDING_LEFT -
      TEXT_PADDING_RIGHT
    );

    canvas.replaceElements(
      [
        {
          type: 'rectangle',
          fillColor: bgColor,
          frame: {
            x: 0,
            y: 0,
            w: CANVAS_WIDTH,
            h: height,
          },
          roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
          trackMouseEnterExit: true,
        },
        {
          type: 'image',
          frame: {
            x: appIconX,
            y: appIconY,
            w: appIconWidth,
            h: appIconHeight,
          },
          image: hs.image.imageFromAppBundle(bundleId),
          trackMouseEnterExit: true,
          trackMouseUp: true,
        },
        {
          type: 'text',
          text: label,
          textColor: BLACK,
          textSize: fontSize,
          frame: {
            x: textX,
            y: textY,
            w: maxTextWidth,
            h: height,
          },
          trackMouseEnterExit: true,
          trackMouseUp: true,
        },
      ]
    );
  }

  const state = {
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
  };

  const CANVAS_WIDTH = 120;
  const canvas = hs.canvas.new({ x, y, w: CANVAS_WIDTH, h: height });

  render();
  canvas.mouseCallback(mouseCallback);
  canvas.show();

  return {
    bringToFront: () => canvas.show(),
    destroy,
    hide: () => canvas.hide(),
    show: () => canvas.show(),
  };
}
