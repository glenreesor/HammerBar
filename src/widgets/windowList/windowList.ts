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

export function getWindowListBuilder(screenId: number) {
  return function getWindowList(
    { x, y, height, width }: { x: number, y: number, height: number, width: number }
  ) {
    function bringToFront() {
      canvas.show();
      state.windowButtonsInfo.forEach((w) => w.actions.bringToFront());
    }

    function destroy() {
      canvas.delete();
      state.windowButtonsInfo.forEach((w) => w.actions.destroy());
      state.timer?.stop();
    }

    function hide() {
      canvas.hide();
      state.windowButtonsInfo.forEach((w) => w.actions.hide());
    }

    function show() {
      canvas.show();
      state.windowButtonsInfo.forEach((w) => w.actions.show());
    }

    function onWindowButtonClick(w: hs.WindowType) {
      if (w.isMinimized()) {
        // Most apps require just focus(), but some like LibreOffice also require raise()
        w.raise();
        w.focus();
      } else {
        w.minimize();
      }
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

    function updateWindowButtonsList(newWindowsList: hs.WindowType[]) {
      const windowListUniquenessString = newWindowsList.reduce(
        (acc, w) => `${acc}_${w.id()}${w.isMinimized()}${w.title()}`,
         ''
      );

      if (windowListUniquenessString !== state.previousWindowList) {
        state.previousWindowList = windowListUniquenessString;

        const newWindowsListIds = newWindowsList.map((w) => w.id());

        // Delete buttons for windows that no longer exist
        const windowButtonIdsToDelete: number[] = [];

        state.windowButtonsInfo.forEach((windowButton) => {
          if (!newWindowsListIds.includes(windowButton.id)) {
            windowButton.actions.destroy();
            windowButtonIdsToDelete.push(windowButton.id);
          }
        });

        state.windowButtonsInfo = state.windowButtonsInfo.filter(
          (windowButton) => !windowButtonIdsToDelete.includes(windowButton.id)
        );

        // Update existing windows (position in bar, minimized state, or window
        // title may have changed)
        let widgetX = x;

        state.windowButtonsInfo.forEach((windowButton) => {
          const newWindowInfo = newWindowsList.find((w) => w.id() === windowButton.id);

          if (newWindowInfo) {
            windowButton.actions.update({
              x: widgetX,
              windowTitle: newWindowInfo.title(),
              isMinimized: newWindowInfo.isMinimized(),
            });

            widgetX += 125;
          }
        });

        // Add buttons that have been created since last render
        newWindowsList.forEach((w) => {
          const existingWindowButton = state.windowButtonsInfo.find(
            (windowButton) => windowButton.id === w.id()
          );

          if (!existingWindowButton) {
            state.windowButtonsInfo.push({
              id: w.id(),
              actions: getWindowButton({
                x: widgetX,
                y: y + 4,
                height: 35,
                bundleId: w.application().bundleID() || 'unknown',
                windowTitle: w.title(),
                isMinimized: w.isMinimized(),
                onClick: () => onWindowButtonClick(w),
              })
            });
            widgetX += 125;
          }
        });
      }
    }

    const canvas = hs.canvas.new({ x, y, w: width, h: height });
    render();

    const state: {
      timer: hs.TimerType | undefined,
      previousWindowList: string,
      windowButtonsInfo: {
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
      windowButtonsInfo: [],
    };

    // Need to save response so we can unsubscribe later
    subscribeToWindowLists(screenId, updateWindowButtonsList);

    return {
      bringToFront,
      destroy,
      hide,
      show,
    };
  }
};
