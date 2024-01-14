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

export function getWindowButton(
  {
    x,
    y,
    height,
    bundleId,
    windowTitle,
    isMinimized,
    onClick,
  }: {
    x: number,
    y: number,
    height: number,
    bundleId: string,
    windowTitle: string,
    isMinimized: boolean,
    onClick: () => void,
  }
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
    let borderWidth;
    let fontSize;
    let iconHeight;
    let iconWidth;
    let iconY;
    let paddingLeft;
    let paddingRight;

    if (state.mouseIsInsideButton) {
      borderWidth = 4;
    } else {
      borderWidth = 0;
    }

    if (state.mouseButtonIsDown) {
      fontSize = 10;
      iconWidth = 0.8 * height;
      iconHeight = iconWidth;
      iconY = 0.1 * height;
      paddingLeft = 2 + 0.2 * height;
      paddingRight = 5;
    } else {
      fontSize = 12;
      iconWidth = height;
      iconHeight = iconWidth;
      iconY = 0;
      paddingLeft = 2;
      paddingRight = 5;
    }

    const borderColor = { red: 0.5, green: 0.5, blue: 0.5 };

    const bgColor = state.isMinimized
      ? { red: 0.7, green: 0.7, blue: 0.7 }
      : { red: 1, green: 1, blue: 1 }

    const textX = paddingLeft + iconWidth;

    const textY = 2;

    const maxTextWidth = (
      CANVAS_WIDTH -
      paddingLeft -
      iconWidth -
      paddingRight
    );

    canvas.replaceElements(
      [
        {
          type: 'rectangle',
          fillColor: bgColor,
          strokeColor: borderColor,
          strokeWidth: borderWidth,
          frame: {
            x: 0,
            y: 0,
            w: CANVAS_WIDTH,
            h: height,
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
          text: state.windowTitle,
          textColor: BLACK,
          textSize: fontSize,
          frame: {
            x: textX,
            y: textY,
            w: maxTextWidth,
            h: height,
          },
          trackMouseDown: true,
          trackMouseEnterExit: true,
          trackMouseUp: true,
        },
      ]
    );
  }

  function updatePosition(x: number) {
    if (x !== state.x) {
      canvas.topLeft({x, y});
    }
  }

  function update(
    { windowTitle, isMinimized }:
    { windowTitle: string, isMinimized: boolean }
  ) {
    if (windowTitle !== state.windowTitle || isMinimized !== state.isMinimized) {
      state.windowTitle = windowTitle;
      state.isMinimized = isMinimized;
      render();
    }

  }

  const state = {
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
    x,
    windowTitle,
    isMinimized,
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
    update,
    updatePosition,
  };
}
