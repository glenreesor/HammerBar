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

import { getWindowButton } from './windowButton';
import { subscribeToWindowLists } from './windowListWatcher';

type WindowButtonsInfoById = Map<
  number,
  {
      w: hs.WindowType,
      actions: {
        bringToFront: () => void,
        destroy: () => void,
        hide: () => void,
        show: () => void,
        update: () => void,
        updatePosition: (x: number) => void,
      }
  }
>;

export function getWindowListBuilder(screenId: number) {
  return function getWindowList(
    { x, y, height, width }: { x: number, y: number, height: number, width: number }
  ) {
    function bringToFront() {
      canvas.show();
      state.windowButtonsInfoById.forEach((w) => w.actions.bringToFront());
    }

    function destroy() {
      canvas.delete();
      state.windowButtonsInfoById.forEach((w) => w.actions.destroy());
      state.timer?.stop();
      state.timer2?.stop();
    }

    function hide() {
      canvas.hide();
      state.windowButtonsInfoById.forEach((w) => w.actions.hide());
    }

    function show() {
      canvas.show();
      state.windowButtonsInfoById.forEach((w) => w.actions.show());
    }

    function render() {
      const color = { red: 150/255, green: 150/255, blue: 150/255 };

      canvas.replaceElements([
        {
          type: 'rectangle',
          fillColor: color,
          strokeColor: color,
          frame: {
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
        },
      ]);
      canvas.show();
    }

    //--------------------------------------------------------------------------

    function updateWindowButtonsList(newWindowsList: hs.WindowType[]) {
      const windowListIds = newWindowsList.reduce(
        (acc, w) => `${acc}_${w.id()}`,
         ''
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

      let windowButtonX = x;
      state.windowButtonsInfoById.forEach((windowButtonInfo, id) => {
        if (newWindowsListMap.has(id)) {
          // Window for this button still exists so add it to our new list
          // and remove from newWindowsListMap so eventually what's remaining
          // will be just newly added windows
          newWindowButtonsInfoById.set(id, windowButtonInfo);
          windowButtonInfo.actions.updatePosition(windowButtonX);
          windowButtonX += 125;

          newWindowsListMap.delete(id);
        } else {
          windowButtonInfo.actions.destroy();
        }
      });

      // The only windows left in newWindowsListMap correspond to newly added
      // windows, so create buttons for those
      newWindowsListMap.forEach((w) => {
        newWindowButtonsInfoById.set(
          w.id(),
          {
            w,
            actions: getWindowButton({
              x: windowButtonX,
              y: y + 4,
              buttonWidth: 120,
              height: 35,
              windowObject: w,
            })
        });
        windowButtonX += 120;
      });

      state.windowButtonsInfoById = newWindowButtonsInfoById;
    }

    function updateWindowButtonsTitleAndMinimized() {
      state.windowButtonsInfoById.forEach((wb) => {
        wb.actions.update();
      });
    }

    const canvas = hs.canvas.new({ x, y, w: width, h: height });
    render();

    const state: {
      timer: hs.TimerType | undefined,
      timer2: hs.TimerType | undefined,
      previousWindowListIds: string,
      windowButtonsInfoById: WindowButtonsInfoById,
    } = {
      timer: undefined,
      timer2: undefined,
      previousWindowListIds: '',
      windowButtonsInfoById: new Map(),
    };

    // Still need to save response so we can unsubscribe later
    subscribeToWindowLists(screenId, updateWindowButtonsList);

    state.timer2 = hs.timer.doEvery(1, updateWindowButtonsTitleAndMinimized);

    return {
      bringToFront,
      destroy,
      hide,
      show,
    };
  }
};
