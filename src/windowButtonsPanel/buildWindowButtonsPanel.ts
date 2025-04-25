// Copyright 2025 Glen Reesor
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

import type { Widget } from 'src/mainPanel';
import type { WindowState } from 'src/windowListAndStateWatcher';
import type { WindowButtonActionsById } from './types';
import { createMoveOrDeleteWindowButtons } from './createMoveOrDeleteWindowButtons';

export function buildWindowButtonsPanel(args: {
  screenId: number;
  geometry: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  subscribeToWindowListUpdates: (
    screenId: number,
    callback: (windowStates: WindowState[]) => void,
  ) => () => void;
}): Widget {
  function bringToFront() {
    state.canvas?.show();
    state.windowButtonActionsById.forEach((w) => w.bringToFront());
  }

  function cleanupPriorToDelete() {
    state.canvas?.hide();
    state.canvas = undefined;

    state.windowButtonActionsById.forEach((w) => w.cleanupPriorToDelete());

    if (state.windowListUnsubscriber) {
      state.windowListUnsubscriber();
    }
  }

  function hide() {
    state.canvas?.hide();
    state.windowButtonActionsById.forEach((w) => w.hide());
    state.isVisible = false;
  }

  function show() {
    state.canvas?.show();
    state.windowButtonActionsById.forEach((w) => w.show());
    state.isVisible = true;
  }

  function render() {
    const color = { red: 150 / 255, green: 150 / 255, blue: 150 / 255 };

    state.canvas?.replaceElements([
      {
        type: 'rectangle',
        fillColor: color,
        strokeColor: color,
        frame: {
          x: 0,
          y: 0,
          w: args.geometry.width,
          h: args.geometry.height,
        },
      },
    ]);
    state.canvas?.show();
  }

  //--------------------------------------------------------------------------

  function handleNewWindowList(newWindowStates: WindowState[]) {
    const updatedWindowButtonActionsById = createMoveOrDeleteWindowButtons({
      panelGeometry: args.geometry,
      isPanelVisible: state.isVisible,
      previousWindowButtonActionsById: state.windowButtonActionsById,
      newWindowStates,
    });

    state.windowButtonActionsById = updatedWindowButtonActionsById;
    updateWindowButtonStates(newWindowStates);
  }

  function updateWindowButtonStates(windowStates: WindowState[]) {
    windowStates.forEach((ws) => {
      const windowButtonActions = state.windowButtonActionsById.get(ws.id);
      windowButtonActions?.setCurrentWindowState(ws);
    });
  }

  const state: {
    canvas: hs.canvas.CanvasType | undefined;
    isVisible: boolean;
    windowButtonActionsById: WindowButtonActionsById;
    windowListUnsubscriber: (() => void) | undefined;
  } = {
    canvas: undefined,
    isVisible: true,
    windowButtonActionsById: new Map(),
    windowListUnsubscriber: undefined,
  };

  state.canvas = hs.canvas.new({
    x: args.geometry.x,
    y: args.geometry.y,
    w: args.geometry.width,
    h: args.geometry.height,
  });
  render();

  state.windowListUnsubscriber = args.subscribeToWindowListUpdates(
    args.screenId,
    handleNewWindowList,
  );

  return {
    width: 0, // this isn't used, but need it for the type
    bringToFront,
    cleanupPriorToDelete,
    hide,
    show,
  };
}
