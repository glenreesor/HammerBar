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

import { getWindowInfo } from 'src/hammerspoonUtils';
import { getWindowButton } from './windowButton';

export function getWindowListBuilder(screenId: number) {
  return function getWindowList(
    { x, y, height, width }: { x: number, y: number, height: number, width: number }
  ) {
    function bringToFront() {
      canvas.show();
      state.windowButtonsWithId.forEach((w) => w.actions.bringToFront());
    }

    function destroy() {
      canvas.delete();
      state.windowButtonsWithId.forEach((w) => w.actions.destroy());
      state.timer?.stop();
    }

    function hide() {
      canvas.hide();
      state.windowButtonsWithId.forEach((w) => w.actions.hide());
    }

    function show() {
      canvas.show();
      state.windowButtonsWithId.forEach((w) => w.actions.show());
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

    function updateWindowButtonsList() {
      const allWindows = hs.window.allWindows().map((hsWindow) => getWindowInfo(hsWindow));
      const currentWindows = allWindows.filter(
        (w) => (
          w.screenId == screenId &&
          w.role === 'AXWindow' &&
          (w.appName !== 'Hammerspoon' || w.windowTitle === 'Hammerspoon Console')
        )
      );
      const windowListUniquenessString = currentWindows.reduce(
        (acc, w) => `${acc}_${w.id}${w.isMinimized}${w.windowTitle}`,
         ''
      );

      if (windowListUniquenessString !== state.previousWindowList) {
        state.previousWindowList = windowListUniquenessString;

        // Delete buttons for windows that no longer exist
        const deletedWindowIds: number[] = [];

        state.windowButtonsWithId.forEach((w) => {
          if (!currentWindows.find((rw) => rw.id === w.id)) {
            w.actions.destroy();
            deletedWindowIds.push(w.id);
          }
        });

        state.windowButtonsWithId = state.windowButtonsWithId.filter((w) =>
          !deletedWindowIds.includes(w.id)
        );

        // Update existing windows (position in bar, minimized state, or window
        // title may have changed)
        let widgetX = x;

        state.windowButtonsWithId.forEach((w) => {
          const newWindowInfo = currentWindows.find((rw) => rw.id === w.id);

          if (newWindowInfo) {
            w.actions.update({
              x: widgetX,
              windowTitle: newWindowInfo.windowTitle,
              isMinimized: newWindowInfo.isMinimized,
            });

            widgetX += 125;
          }
        });

        // Add buttons that have been created since last render
        currentWindows.forEach((rw) => {
          const existingWindowButton = state.windowButtonsWithId.find((w) => w.id === rw.id);

          if (!existingWindowButton) {
            state.windowButtonsWithId.push({
              id: rw.id,
              actions: getWindowButton({
                x: widgetX,
                y: y + 4,
                height: 35,
                bundleId: rw.bundleId,
                windowTitle: rw.windowTitle,
                isMinimized: rw.isMinimized,
                onClick: () => print(rw.isMinimized ? 'isMinimized' : 'isNotMinimized'),
              })
            });
            widgetX += 125;
          }
        });
      }
      state.timer = hs.timer.doAfter(1, updateWindowButtonsList);
    }

    const canvas = hs.canvas.new({ x, y, w: width, h: height });
    render();

    const state: {
      timer: hs.TimerType | undefined,
      previousWindowList: string,
      windowButtonsWithId: {
        id: number,
        actions: {
          bringToFront: () => void,
          destroy: () => void,
          hide: () => void,
          show: () => void,
          update: (
            { x }:
            { x: number, windowTitle: string, isMinimized: boolean }
          ) => void,
        }
      }[],
    } = {
      timer: undefined,
      previousWindowList: '',
      windowButtonsWithId: [],
    };

    updateWindowButtonsList();

    return {
      bringToFront,
      destroy,
      hide,
      show,
    };
  }
};
