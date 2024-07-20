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

import type { WidgetBuilderReturnType } from 'src/Panel';
import { getWindowButton } from './windowButton';
import { subscribeToWindowLists } from './windowListWatcher';

type WindowButtonsInfoById = Map<
  number,
  {
    w: hs.WindowType;
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

export function getWindowListBuilder(screenId: number) {
  return function getWindowList(args: {
    coords: { x: number; y: number };
    dimensions: { height: number; width: number };
  }): WidgetBuilderReturnType {
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
    }

    function show() {
      state.canvas?.show();
      state.windowButtonsInfoById.forEach((w) => w.actions.show());
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
            w: args.dimensions.width,
            h: args.dimensions.height,
          },
        },
      ]);
      state.canvas?.show();
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

    function updateWindowButtonsList(newWindowsList: hs.WindowType[]) {
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

      const buttonWidth = getButtonWidth(
        args.dimensions.width,
        newWindowsList.length,
      );

      let windowButtonX = args.coords.x + BUTTON_PADDING;
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
          windowButtonX += buttonWidth + BUTTON_PADDING;

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
            y: args.coords.y + 4,
            buttonWidth,
            buttonHeight: 35,
            windowObject: w,
          }),
        });
        windowButtonX += buttonWidth + BUTTON_PADDING;
      });

      state.windowButtonsInfoById = newWindowButtonsInfoById;
    }

    function updateWindowButtonsTitleAndMinimized() {
      state.windowButtonsInfoById.forEach((wb) => {
        wb.actions.update();
      });
    }

    const BUTTON_PADDING = 5;

    const state: {
      canvas: hs.CanvasType | undefined;
      titlesAndMinimizedStateTimer: hs.TimerType | undefined;
      previousWindowListIds: string;
      windowButtonsInfoById: WindowButtonsInfoById;
      windowListUnsubscriber: (() => void) | undefined;
    } = {
      canvas: undefined,
      titlesAndMinimizedStateTimer: undefined,
      previousWindowListIds: '',
      windowButtonsInfoById: new Map(),
      windowListUnsubscriber: undefined,
    };

    state.canvas = hs.canvas.new({
      x: args.coords.x,
      y: args.coords.y,
      w: args.dimensions.width,
      h: args.dimensions.height,
    });
    render();

    state.windowListUnsubscriber = subscribeToWindowLists(
      screenId,
      updateWindowButtonsList,
    );

    state.titlesAndMinimizedStateTimer = hs.timer.doEvery(
      1,
      updateWindowButtonsTitleAndMinimized,
    );

    return {
      bringToFront,
      cleanupPriorToDelete,
      hide,
      show,
    };
  };
}
