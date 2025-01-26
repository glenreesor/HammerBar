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

import type { WidgetBuilderReturnType } from 'src/panel';
import { getWindowButton } from './windowButton';
import { subscribeToWindowListUpdates } from './windowListWatcher';
import { DEFAULT_THEME } from 'src/theme';

type WindowButtonsInfoById = Map<
  number,
  {
    w: hs.window.WindowType;
    actions: {
      bringToFront: () => void;
      cleanupPriorToDelete: () => void;
      hide: () => void;
      show: () => void;
      update: () => void;
      updatePositionAndWidth: (x: number, width: number) => void;
    };
  }
>;

export function getWindowListBuilder(
  screenId: number,
  windowStatusUpdateInterval: number,
) {
  return function getWindowList(args: {
    coords: { x: number; y: number };
    dimensions: { height: number; width: number };
  }): WidgetBuilderReturnType {
    function bringToFront() {
      state.fillerPanel?.show();
      state.windowButtonsInfoById.forEach((w) => w.actions.bringToFront());
    }

    function cleanupPriorToDelete() {
      state.fillerPanel?.hide();
      state.fillerPanel = undefined;
      state.windowButtonsInfoById.forEach((w) =>
        w.actions.cleanupPriorToDelete(),
      );
      state.titlesAndMinimizedStateTimer?.stop();

      if (state.windowListUnsubscriber) {
        state.windowListUnsubscriber();
      }
    }

    function hide() {
      state.fillerPanel?.hide();
      state.windowButtonsInfoById.forEach((w) => w.actions.hide());
      state.isVisible = false;
    }

    function show() {
      state.fillerPanel?.show();
      state.windowButtonsInfoById.forEach((w) => w.actions.show());
      state.isVisible = true;
    }

    //--------------------------------------------------------------------------

    function getButtonWidth(totalWidth: number, numButtons: number) {
      const MAX_BUTTON_WIDTH = 120;

      // Layout looks like this:
      //    [leftEdge] [padding] [button] [padding] [button] [padding] [rightEdge]
      const buttonWidth =
        (totalWidth - (numButtons + 1) * BUTTON_PADDING) / numButtons;

      return Math.min(buttonWidth, MAX_BUTTON_WIDTH);
    }

    function updateWindowButtonsList(newWindowsList: hs.window.WindowType[]) {
      const windowListIds = newWindowsList.reduce(
        (acc, w) => `${acc}_${w.id()}`,
        '',
      );

      if (windowListIds === state.previousWindowListIds) {
        // List of windows hasn't changed so nothing to update
        return;
      }

      state.previousWindowListIds = windowListIds;

      // Build up a new object containing window buttons for windows that
      // still exist
      const newWindowsListMap = new Map(newWindowsList.map((w) => [w.id(), w]));
      const newWindowButtonsInfoById: WindowButtonsInfoById = new Map();

      const buttonWidth =
        getButtonWidth(args.dimensions.width, newWindowsList.length) +
        BUTTON_PADDING;

      let windowButtonX = args.coords.x; //  + BUTTON_PADDING;
      state.windowButtonsInfoById.forEach((windowButtonInfo, id) => {
        if (newWindowsListMap.has(id)) {
          // Window for this button still exists so add it to our new list
          // and remove from newWindowsListMap so eventually what's remaining
          // will be just newly added windows
          newWindowButtonsInfoById.set(id, windowButtonInfo);
          windowButtonInfo.actions.updatePositionAndWidth(
            windowButtonX,
            buttonWidth,
          );
          windowButtonX += buttonWidth; // + BUTTON_PADDING;

          newWindowsListMap.delete(id);
        } else {
          windowButtonInfo.actions.cleanupPriorToDelete();
        }
      });

      // The only windows left in newWindowsListMap correspond to newly added
      // windows, so create buttons for those
      newWindowsListMap.forEach((w) => {
        newWindowButtonsInfoById.set(w.id(), {
          w,
          actions: getWindowButton({
            x: windowButtonX,
            y: args.coords.y, // + 4,
            buttonWidth,
            buttonHeight: 45, // 35,
            windowObject: w,
            isInitiallyVisible: state.isVisible,
          }),
        });
        windowButtonX += buttonWidth; // + BUTTON_PADDING;
      });

      state.windowButtonsInfoById = newWindowButtonsInfoById;

      // Adjust width of filler panel so it's not underneath the window buttons
      const newFillerX = state.windowButtonsInfoById.size * buttonWidth;
      const newFillerWidth = args.dimensions.width - newFillerX;

      state.fillerPanel?.replaceElements([
        {
          type: 'rectangle',
          fillColor: DEFAULT_THEME.windowButtonsPanel.background,
          strokeColor: DEFAULT_THEME.windowButtonsPanel.background,
          frame: {
            x: newFillerX,
            y: 0,
            w: newFillerWidth,
            h: args.dimensions.height,
          },
        },
      ]);
    }

    function updateWindowButtonsTitleAndMinimized() {
      state.windowButtonsInfoById.forEach((wb) => {
        wb.actions.update();
      });
    }

    const BUTTON_PADDING = 5;

    const state: {
      isVisible: boolean;
      titlesAndMinimizedStateTimer: hs.timer.TimerType | undefined;
      previousWindowListIds: string;
      windowButtonsInfoById: WindowButtonsInfoById;
      windowListUnsubscriber: (() => void) | undefined;
      fillerPanel: hs.canvas.CanvasType | undefined;
    } = {
      isVisible: true,
      titlesAndMinimizedStateTimer: undefined,
      previousWindowListIds: '',
      windowButtonsInfoById: new Map(),
      windowListUnsubscriber: undefined,
      fillerPanel: undefined,
    };

    state.windowListUnsubscriber = subscribeToWindowListUpdates(
      screenId,
      updateWindowButtonsList,
    );

    state.titlesAndMinimizedStateTimer = hs.timer.doEvery(
      windowStatusUpdateInterval,
      updateWindowButtonsTitleAndMinimized,
    );

    state.fillerPanel = hs.canvas.new({
      x: args.coords.x,
      y: args.coords.y,
      w: args.dimensions.width,
      h: args.dimensions.height,
    });
    state.fillerPanel.alpha(DEFAULT_THEME.windowButtonsPanel.alpha);

    state.fillerPanel.replaceElements([
      {
        type: 'rectangle',
        fillColor: DEFAULT_THEME.windowButtonsPanel.background,
        strokeColor: DEFAULT_THEME.windowButtonsPanel.background,
        frame: {
          x: 0,
          y: 0,
          w: args.dimensions.width,
          h: args.dimensions.height,
        },
      },
    ]);
    state.fillerPanel.show();

    return {
      bringToFront,
      cleanupPriorToDelete,
      hide,
      show,
    };
  };
}
