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

import type { WindowState } from 'src/windowListAndStateWatcher';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from '../../widgets/_helpers/util';
import { renderHoverWindowPreview } from './renderHoverWindowPreview';
import { renderWindowButton } from './renderWindowButton';
import type { ButtonGeometry, State } from './types';

export function buildWindowButton(args: {
  buttonGeometry: ButtonGeometry;
  windowState: WindowState;
  isInitiallyVisible: boolean;
}) {
  const {
    buttonGeometry: initialButtonGeometry,
    windowState,
    isInitiallyVisible,
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

  const mouseCallback: hs.canvas.CanvasMouseCallback = function (
    this: void,
    _canvas: hs.canvas.Canvas,
    msg: 'mouseEnter' | 'mouseExit' | 'mouseDown' | 'mouseUp',
  ) {
    if (msg === 'mouseEnter') {
      state.mouseIsInsideButton = true;
      render();
      renderHoverWindowPreview(state);
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
      state.windowState.onClick();
    }
  };

  function render() {
    renderWindowButton(state);
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

    state.windowState = newState;

    if (stateIsDifferent) {
      render();
    }
  }

  const state: State = {
    canvases: {
      mainCanvas: undefined,
      hoverCanvas: undefined,
    },
    buttonGeometry: initialButtonGeometry,
    mouseButtonIsDown: false,
    mouseIsInsideButton: false,
    windowState,
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
