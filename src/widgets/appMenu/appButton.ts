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

import { BLACK } from 'src/constants';
import type { WidgetBuilderParams } from 'src/panel';

export function getAppButton({
  coords,
  widgetHeight,
  panelColor,
  panelHoverColor,
  bundleId,
  label,
  onClick,
}: WidgetBuilderParams & {
  bundleId: string;
  label: string;
  onClick: () => void;
}) {
  function cleanupPriorToDelete() {
    state.canvas?.hide();
    state.canvas = undefined;
  }

  const mouseCallback: hs.canvas.CanvasMouseCallbackType = function (
    this: void,
    _canvas: hs.canvas.CanvasType,
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
  };

  function render() {
    let bgColor;
    let fontSize;
    let iconHeight;
    let iconWidth;
    let iconY;
    let paddingLeft;
    let paddingRight;

    if (state.mouseIsInsideButton) {
      bgColor = panelColor;
    } else {
      bgColor = panelHoverColor;
    }

    if (state.mouseButtonIsDown) {
      fontSize = 10;
      iconWidth = 0.8 * widgetHeight;
      iconHeight = iconWidth;
      iconY = 0.1 * widgetHeight;
      paddingLeft = 2 + 0.2 * widgetHeight;
      paddingRight = 5;
    } else {
      fontSize = 12;
      iconWidth = widgetHeight;
      iconHeight = iconWidth;
      iconY = 0;
      paddingLeft = 2;
      paddingRight = 5;
    }

    const textX = paddingLeft + iconWidth;

    // We're only expecting one line of text, so center it on the icon
    const textY = iconY + iconHeight / 2 - (1.4 * fontSize) / 2;

    const maxTextWidth = CANVAS_WIDTH - paddingLeft - iconWidth - paddingRight;

    state.canvas?.replaceElements([
      {
        type: 'rectangle',
        fillColor: bgColor,
        frame: {
          x: 0,
          y: 0,
          w: CANVAS_WIDTH,
          h: widgetHeight,
        },
        roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
        trackMouseDown: true,
        trackMouseEnterExit: true,
        trackMouseUp: true,
      },
      {
        type: 'image',
        frame: {
          x: paddingLeft,
          y: iconY,
          w: iconWidth,
          h: iconWidth,
        },
        image: hs.image.imageFromAppBundle(bundleId),
        trackMouseDown: true,
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
          h: widgetHeight,
        },
        trackMouseDown: true,
        trackMouseEnterExit: true,
        trackMouseUp: true,
      },
    ]);
  }

  const state: {
    canvas: hs.canvas.CanvasType | undefined;
    mouseButtonIsDown: boolean;
    mouseIsInsideButton: boolean;
  } = {
    canvas: undefined,
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
  };

  const CANVAS_WIDTH = 120;
  state.canvas = hs.canvas.new({
    x: coords.x,
    y: coords.y,
    w: CANVAS_WIDTH,
    h: widgetHeight,
  });

  render();
  state.canvas.mouseCallback(mouseCallback);
  state.canvas.show();

  return {
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    hide: () => state.canvas?.hide(),
    show: () => state.canvas?.show(),
  };
}
