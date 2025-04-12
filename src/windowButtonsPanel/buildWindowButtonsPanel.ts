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
import type { WindowButtonsInfoById } from './types';
import { createMoveOrDeleteWindowButtons } from './createMoveOrDeleteWindowButtons';

export function buildWindowButtonsPanel(args: {
  screenId: number;
  windowStatusUpdateInterval: number;
  showWindowPreviewOnHover: boolean;
  geometry: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  subscribeToWindowListUpdates: (
    screenId: number,
    callback: (windows: hs.window.WindowType[]) => void,
  ) => () => void;
}): Widget {
  function bringToFront() {
    state.canvas?.show();
    state.windowButtonsInfoById.forEach((w) => w.actions.bringToFront());
  }

  function cleanupPriorToDelete() {
    state.canvas?.hide();
    state.canvas = undefined;

    state.windowButtonsInfoById.forEach((w) =>
      w.actions.cleanupPriorToDelete(),
    );
    state.titlesAndMinimizedStateTimer?.stop();

    if (state.windowListUnsubscriber) {
      state.windowListUnsubscriber();
    }
  }

  function hide() {
    state.canvas?.hide();
    state.windowButtonsInfoById.forEach((w) => w.actions.hide());
    state.isVisible = false;
  }

  function show() {
    state.canvas?.show();
    state.windowButtonsInfoById.forEach((w) => w.actions.show());
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

  function handleNewWindowList(newWindowsList: hs.window.WindowType[]) {
    state.windowButtonsInfoById = createMoveOrDeleteWindowButtons({
      panelGeometry: args.geometry,
      isPanelVisible: state.isVisible,
      showWindowPreviewOnHover: args.showWindowPreviewOnHover,
      previousWindowButtonsInfoById: state.windowButtonsInfoById,
      newWindowsList,
    });
  }

  function updateWindowButtonsTitleAndMinimized() {
    state.windowButtonsInfoById.forEach((wb) => {
      wb.actions.setCurrentWindowState({
        title: wb.w.title(),
        isMinimized: wb.w.isMinimized(),
      });
    });
  }

  const state: {
    canvas: hs.canvas.CanvasType | undefined;
    isVisible: boolean;
    titlesAndMinimizedStateTimer: hs.timer.TimerType | undefined;
    windowButtonsInfoById: WindowButtonsInfoById;
    windowListUnsubscriber: (() => void) | undefined;
  } = {
    canvas: undefined,
    isVisible: true,
    titlesAndMinimizedStateTimer: undefined,
    windowButtonsInfoById: new Map(),
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

  state.titlesAndMinimizedStateTimer = hs.timer.doEvery(
    args.windowStatusUpdateInterval,
    updateWindowButtonsTitleAndMinimized,
  );

  return {
    width: 0, // this isn't used, but need it for the type
    bringToFront,
    cleanupPriorToDelete,
    hide,
    show,
  };
}
