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

import { printWindowInfo } from 'src/utils';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from '../../widgets/_helpers/util';
import { renderHover } from './renderHover';
import { renderWindowButton } from './renderWindowButton';
import type { State } from './types';

export function buildWindowButton(args: {
  x: number;
  y: number;
  buttonWidth: number;
  buttonHeight: number;
  windowObject: hs.window.WindowType;
  isInitiallyVisible: boolean;
  showWindowPreviewOnHover: boolean;
}) {
  const {
    x: windowButtonX,
    y: windowButtonY,
    buttonWidth,
    buttonHeight,
    windowObject,
    isInitiallyVisible,
    showWindowPreviewOnHover,
  } = args;

  function cleanupPriorToDelete() {
    deleteCanvasesAndStopTimers(Object.values(state.canvases), []);
  }

  function hide() {
    hideCanvases(Object.values(state.canvases));
  }

  function show() {
    showCanvases(Object.values(state.canvases));
  }

  const mouseCallback: hs.canvas.CanvasMouseCallbackType = function (
    this: void,
    _canvas: hs.canvas.CanvasType,
    msg: 'mouseEnter' | 'mouseExit' | 'mouseDown' | 'mouseUp',
  ) {
    if (msg === 'mouseEnter') {
      state.mouseIsInsideButton = true;
      render();
      renderHover({
        state,
        y: windowButtonY,
        showWindowPreviewOnHover,
      });
    } else if (msg === 'mouseExit') {
      state.mouseIsInsideButton = false;
      state.mouseButtonIsDown = false;
      render();

      if (state.canvases.hoverCanvas !== undefined) {
        state.canvases.hoverCanvas.hide();
        state.canvases.hoverCanvas = undefined;
      }
    } else if (msg === 'mouseDown') {
      state.mouseButtonIsDown = true;
      render();
    } else if (msg === 'mouseUp') {
      state.mouseButtonIsDown = false;
      render();
      handleClick();
    }
  };

  function render() {
    renderWindowButton({
      state,
      bundleId,
      buttonHeight,
    });
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
      const windowIdsFrontToBack = hs.window
        .orderedWindows()
        .map((w) => w.id());

      if (!windowIdsFrontToBack.includes(w.id())) {
        // Hammerspoon returns an empty image for snapshots of minimized windows,
        // so grab an updated snapshot now before minimizing
        state.windowSnapshot = state.windowObject.snapshot();

        // This is a special case corresponding to the Hammerspoon console.
        // Since it doesn't show up in the window list we don't know it's stacking
        // position.
        w.minimize();
      }

      if (windowIdsFrontToBack[0] === w.id()) {
        // Hammerspoon returns an empty image for snapshots of minimized windows,
        // so grab an updated snapshot now before minimizing
        state.windowSnapshot = state.windowObject.snapshot();
        w.minimize();
      } else {
        w.raise();
        w.focus();
      }
    }
  }

  function update() {
    const windowObjectTitle = state.windowObject.title();
    const applicationName = state.windowObject.application()?.name() || '';

    const newWindowTitle =
      windowObjectTitle !== '' ? windowObjectTitle : applicationName;

    const newIsMinimized = state.windowObject.isMinimized();

    if (!newIsMinimized) {
      // Hammerspoon returns an empty image for snapshots of minimized windows.
      // (Have I mentioned that before?)
      // We're not minimized, so update our snapshot to keep it fresh
      state.windowSnapshot = state.windowObject.snapshot();
    }

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
      state.canvases.mainCanvas?.frame({
        x: x,
        y: windowButtonY,
        w: width,
        h: buttonHeight,
      });
      state.width = width;
      state.x = x;
      render();
    }
  }

  // Save bundleId, title, minimized status so we don't have to query a window
  // object for simple updates like changing position. These calls might hang
  // hammerspoon if the corresponding app is hung
  const bundleId = windowObject.application()?.bundleID() || '';

  const state: State = {
    canvases: {
      mainCanvas: undefined,
      hoverCanvas: undefined,
    },
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
    x: windowButtonX,
    width: buttonWidth,
    windowObject,
    windowTitle: windowObject.title(),
    windowSnapshot: undefined,
    isMinimized: windowObject.isMinimized(),
  };

  state.canvases.mainCanvas = hs.canvas.new({
    x: windowButtonX,
    y: windowButtonY,
    w: buttonWidth,
    h: buttonHeight,
  });

  render();
  state.canvases.mainCanvas.mouseCallback(mouseCallback);

  if (isInitiallyVisible) {
    state.canvases.mainCanvas.show();
  }

  return {
    bringToFront: () => state.canvases.mainCanvas?.show(),
    cleanupPriorToDelete,
    hide,
    show,
    update,
    updatePositionAndWidth,
  };
}
