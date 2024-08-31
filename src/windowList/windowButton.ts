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
import { printWindowInfo } from 'src/utils';

export function getWindowButton({
  x,
  y,
  buttonWidth,
  buttonHeight,
  windowObject,
  isInitiallyVisible,
}: {
  x: number;
  y: number;
  buttonWidth: number;
  buttonHeight: number;
  windowObject: hs.WindowType;
  isInitiallyVisible: boolean;
}) {
  function cleanupPriorToDelete() {
    state.mainCanvas?.hide();
    state.mainCanvas = undefined;

    state.hoverCanvas?.hide();
    state.hoverCanvas = undefined;
  }

  const mouseCallback: hs.CanvasMouseCallbackType = function (
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
      handleClick();
    }
  };

  function renderHoveredTitle() {
    const fontSize = 12;
    const width = state.windowTitle.length * fontSize * 0.75;
    const height = fontSize * 2;

    if (state.hoverCanvas === undefined) {
      state.hoverCanvas = hs.canvas.new({
        x: state.x,
        y: y - fontSize * 2,
        w: width,
        h: height,
      });
    }
    state.hoverCanvas.replaceElements([
      {
        type: 'rectangle',
        fillColor: { red: 1, green: 1, blue: 1 },
        frame: {
          x: 0,
          y: 0,
          w: width,
          h: height,
        },
        roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      },
      {
        type: 'text',
        text: state.windowTitle,
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: 10,
          y: 5,
          w: width,
          h: height,
        },
      },
    ]);
    state.hoverCanvas.show();
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
      iconWidth = 0.8 * buttonHeight;
      iconHeight = iconWidth;
      iconY = 0.1 * buttonHeight;
      paddingLeft = 2 + 0.2 * buttonHeight;
      paddingRight = 5;
    } else {
      fontSize = 12;
      iconWidth = buttonHeight;
      iconHeight = iconWidth;
      iconY = 0;
      paddingLeft = 2;
      paddingRight = 5;
    }

    const borderColor = { red: 0.5, green: 0.5, blue: 0.5 };

    const bgColor = state.isMinimized
      ? { red: 0.7, green: 0.7, blue: 0.7 }
      : { red: 1, green: 1, blue: 1 };

    const textX = paddingLeft + iconWidth;

    const textY = 2;

    const maxTextWidth = state.width - paddingLeft - iconWidth - paddingRight;

    state.mainCanvas?.replaceElements([
      {
        type: 'rectangle',
        fillColor: bgColor,
        strokeColor: borderColor,
        strokeWidth: borderWidth,
        frame: {
          x: 0,
          y: 0,
          w: state.width,
          h: buttonHeight,
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
          h: buttonHeight,
        },
      },
    ]);

    if (state.mouseIsInsideButton) {
      renderHoveredTitle();
    } else {
      if (state.hoverCanvas !== undefined) {
        state.hoverCanvas.hide();
        state.hoverCanvas = undefined;
      }
    }
  }

  function handleClick() {
    const w = state.windowObject;
    const keyboardModifiers = hs.eventtap.checkKeyboardModifiers();

    if (keyboardModifiers.shift) {
      // User just wants to dump the window info without toggling window visibility
      printWindowInfo(w);
      return;
    }

    if (w.isMinimized()) {
      // Most apps require just focus(), but some like LibreOffice also require raise()
      w.raise();
      w.focus();
    } else {
      // If window is already completely visible minimize it, otherwise bring
      // it to the foreground
      const windowsFrontToBack = hs.window.orderedWindows();

      if (windowsFrontToBack.length === 0) {
        // This is an odd edge case corresponding to the Hammerspoon console
        // being visible (and no other windows).
        w.minimize();
      } else if (windowsFrontToBack[0].id() === w.id()) {
        w.minimize();
      } else {
        w.raise();
        w.focus();
      }
    }
  }

  function update() {
    const newWindowTitle = state.windowObject.title();
    const newIsMinimized = state.windowObject.isMinimized();
    if (
      newWindowTitle !== state.windowTitle ||
      newIsMinimized !== state.isMinimized
    ) {
      state.windowTitle = newWindowTitle;
      state.isMinimized = newIsMinimized;
      render();
    }
  }

  function updatePositionAndWidth(x: number, width: number) {
    if (x !== state.x || width !== state.width) {
      state.mainCanvas?.frame({ x: x, y: y, w: width, h: buttonHeight });
      state.width = width;
      state.x = x;
      render();
    }
  }

  // Save bundleId, title, minimized status so we don't have to query a window
  // object for simple updates like changing position. These calls might hang
  // hammerspoon if the corresponding app is hung
  const bundleId = windowObject.application()?.bundleID() || '';

  const state: {
    mainCanvas: hs.CanvasType | undefined;
    hoverCanvas: hs.CanvasType | undefined;
    mouseButtonIsDown: boolean;
    mouseIsInsideButton: boolean;
    x: number;
    width: number;
    windowObject: hs.WindowType;
    windowTitle: string;
    isMinimized: boolean;
  } = {
    mainCanvas: undefined,
    hoverCanvas: undefined,
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
    x,
    width: buttonWidth,
    windowObject,
    windowTitle: windowObject.title(),
    isMinimized: windowObject.isMinimized(),
  };

  state.mainCanvas = hs.canvas.new({ x, y, w: buttonWidth, h: buttonHeight });

  render();
  state.mainCanvas.mouseCallback(mouseCallback);

  if (isInitiallyVisible) {
    state.mainCanvas.show();
  }

  return {
    bringToFront: () => state.mainCanvas?.show(),
    cleanupPriorToDelete,
    hide: () => state.mainCanvas?.hide(),
    show: () => state.mainCanvas?.show(),
    update,
    updatePositionAndWidth,
  };
}
