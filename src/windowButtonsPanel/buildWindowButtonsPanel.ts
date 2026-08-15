// Copyright 2025, 2026 Glen Reesor
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

import type { WidgetHandle } from 'src/mainPanel';
import type { WindowState } from 'src/windowListAndStateWatcher';
import type { WindowButtonActionsById } from './types';
import { createMoveOrDeleteWindowButtons } from './createMoveOrDeleteWindowButtons';
import { getTheme } from 'src/theme';

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
}): WidgetHandle {
  const theme = getTheme();

  function bringToFront() {
    state.rightFillerPanel?.show();
    state.windowButtonActionsById.forEach((w) => w.bringToFront());
  }

  function prepareForRemoval() {
    state.rightFillerPanel?.hide();
    state.rightFillerPanel = undefined;
    state.windowButtonActionsById.forEach((w) => w.prepareForRemoval());

    if (state.windowListUnsubscriber) {
      state.windowListUnsubscriber();
    }
  }

  function hide() {
    state.rightFillerPanel?.hide();
    state.windowButtonActionsById.forEach((w) => w.hide());
    state.isVisible = false;
  }

  function show() {
    state.rightFillerPanel?.show();
    state.windowButtonActionsById.forEach((w) => w.show());
    state.isVisible = true;
  }

  //--------------------------------------------------------------------------

  // Hack for now. This should not be duplicated from createMoveOrDeleteWindowButtons
  const BUTTON_PADDING = 5;

  function getButtonWidth(totalWidth: number, numButtons: number) {
    const MAX_BUTTON_WIDTH = 120;

    // Layout looks like this:
    //    [leftEdge] [padding] [button] [padding] [button] [padding] [rightEdge]
    const buttonWidth =
      (totalWidth - (numButtons + 1) * BUTTON_PADDING) / numButtons;

    return Math.min(buttonWidth, MAX_BUTTON_WIDTH);
  }

  function handleNewWindowList(newWindowStates: WindowState[]) {
    const updatedWindowButtonActionsById = createMoveOrDeleteWindowButtons({
      panelGeometry: args.geometry,
      isPanelVisible: state.isVisible,
      previousWindowButtonActionsById: state.windowButtonActionsById,
      newWindowStates,
    });

    state.windowButtonActionsById = updatedWindowButtonActionsById;
    updateWindowButtonStates(newWindowStates);

    // Adjust width of filler panel so it's not underneath the window buttons
    const newFillerX =
      state.windowButtonActionsById.size *
      getButtonWidth(args.geometry.width, state.windowButtonActionsById.size);
    const newFillerWidth = args.geometry.width - newFillerX;

    state.rightFillerPanel?.replaceElements([
      {
        type: 'rectangle',
        fillColor: theme.windowButtonsPanel.background,
        strokeColor: theme.windowButtonsPanel.background,
        frame: {
          x: newFillerX,
          y: 0,
          w: newFillerWidth,
          h: args.geometry.height,
        },
      },
    ]);
  }

  function updateWindowButtonStates(windowStates: WindowState[]) {
    windowStates.forEach((ws) => {
      const windowButtonActions = state.windowButtonActionsById.get(ws.id);
      windowButtonActions?.setCurrentWindowState(ws);
    });
  }

  const state: {
    isVisible: boolean;
    windowButtonActionsById: WindowButtonActionsById;
    windowListUnsubscriber: (() => void) | undefined;
    rightFillerPanel: hs.canvas.Canvas | undefined;
  } = {
    isVisible: true,
    windowButtonActionsById: new Map(),
    windowListUnsubscriber: undefined,
    rightFillerPanel: undefined,
  };

  state.windowListUnsubscriber = args.subscribeToWindowListUpdates(
    args.screenId,
    handleNewWindowList,
  );

  state.rightFillerPanel = hs.canvas.new({
    x: args.geometry.x,
    y: args.geometry.y,
    w: args.geometry.width,
    h: args.geometry.height,
  });

  state.rightFillerPanel.replaceElements([
    {
      type: 'rectangle',
      fillColor: theme.windowButtonsPanel.background,
      strokeColor: theme.windowButtonsPanel.background,
      frame: {
        x: 0,
        y: 0,
        w: args.geometry.width,
        h: args.geometry.height,
      },
    },
  ]);

  state.rightFillerPanel.alpha(theme.windowButtonsPanel.alpha);
  state.rightFillerPanel.show();

  return {
    width: 0, // this isn't used, but need it for the type
    bringToFront,
    prepareForRemoval,
    hide,
    show,
  };
}
