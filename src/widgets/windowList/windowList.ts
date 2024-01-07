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
      state.windowButtons.forEach((w) => w.bringToFront());
    }

    function destroy() {
      canvas.delete();
      state.windowButtons.forEach((w) => w.destroy());
      state.timer?.stop();
    }

    function hide() {
      canvas.hide();
      state.windowButtons.forEach((w) => w.hide());
    }

    function show() {
      canvas.show();
      state.windowButtons.forEach((w) => w.show());
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
      const windows = hs.window.allWindows().map((hsWindow) => getWindowInfo(hsWindow));
      const regularWindows = windows.filter(
        (w) => w.screenId == screenId && w.role === 'AXWindow' && (w.appName !== 'Hammerspoon' || w.windowTitle === 'Hammerspoon Console')
      );
      const windowListUniquenessString = regularWindows.reduce(
        (acc, w) => `${acc}_${w.id}${w.isMinimized}${w.windowTitle}`,
         ''
      );

      if (windowListUniquenessString !== state.previousWindowList) {
        state.previousWindowList = windowListUniquenessString;

        const oldWindowButtons = state.windowButtons;

        state.windowButtons = [];
        let buttonX = x;

        regularWindows.forEach((w) => {
          state.windowButtons.push(getWindowButton({
            x: buttonX,
            y: y + 4,
            height: 35,
            bundleId: w.bundleId,
            windowTitle: w.windowTitle,
            isMinimized: w.isMinimized,
            onClick: () => print(w.isMinimized ? 'isMinimized' : 'isNotMinimized'),
          }));
          buttonX += 125;
        });

        // Delay destroying these buttons so there's time for the new list of
        // window buttons to be rendered (on top of these ones), thereby eliminating
        // flash of redraw
        hs.timer.doAfter(0, () => oldWindowButtons.forEach((w) => w.destroy()));
      }

      state.timer = hs.timer.doAfter(1, updateWindowButtonsList);
    }

    const canvas = hs.canvas.new({ x, y, w: width, h: height });
    render();

    const state: {
      timer: hs.TimerType | undefined,
      previousWindowList: string,
      windowButtons: {
        bringToFront: () => void,
        destroy: () => void,
        hide: () => void,
        show: () => void,
      }[]
    } = {
      timer: undefined,
      previousWindowList: '',
      windowButtons: [],
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
