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
import type { ButtonGeometry, State, WindowState } from './types';

export function buildWindowButton(args: {
  buttonGeometry: ButtonGeometry;
  windowState: WindowState;
  windowObject: hs.window.WindowType;
  isInitiallyVisible: boolean;
  showWindowPreviewOnHover: boolean;
}) {
  const {
    buttonGeometry: initialButtonGeometry,
    windowState: initialWindowState,
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

  function setCurrentButtonGeometry(newGeometry: ButtonGeometry) {
    const geomIsDifferent =
      state.buttonGeometry.x !== newGeometry.x ||
      state.buttonGeometry.y !== newGeometry.y ||
      state.buttonGeometry.width !== newGeometry.width ||
      state.buttonGeometry.height !== newGeometry.height;

    if (geomIsDifferent) {
      state.buttonGeometry = newGeometry;

      state.canvases.mainCanvas?.frame({
        x: state.buttonGeometry.x,
        y: state.buttonGeometry.y,
        w: state.buttonGeometry.width,
        h: state.buttonGeometry.height,
      });

      render();
    }
  }

  function setCurrentWindowState(newState: WindowState) {
    const stateIsDifferent =
      state.windowState.title !== newState.title ||
      state.windowState.isMinimized !== newState.isMinimized;

    if (stateIsDifferent) {
      if (!newState.isMinimized) {
        // We're not minimized, so update our cached snapshot, which gets
        // used when we *are* minimized
        state.windowSnapshot = state.windowObject.snapshot();
      }
      state.windowState = newState;
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
    buttonGeometry: initialButtonGeometry,
    windowState: initialWindowState,
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
    windowObject,

    // Save a snapshot so if it gets minimized, we'll have something to show
    windowSnapshot: windowObject.snapshot(),
  };

  state.canvases.mainCanvas = hs.canvas.new({
    x: initialButtonGeometry.x,
    y: initialButtonGeometry.y,
    w: initialButtonGeometry.width,
    h: initialButtonGeometry.height,
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
    setCurrentButtonGeometry,
    setCurrentWindowState,
  };
}
