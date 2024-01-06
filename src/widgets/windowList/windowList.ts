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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';

export function getWindowListBuilder(): WidgetBuildingInfo {
  function getWindowList(
    { x, y, height }: WidgetBuilderParams
  ) {
    function bringToFront() {
      canvas.show();
    }

    function destroy() {
      canvas.delete();
      state.timer.stop();
    }

    function hide() {
      canvas.hide();
    }

    function show() {
      canvas.show();
    }

    function render() {
      print('rendering');
      const color = { red: 150/255, green: 150/255, blue: 150/255 };

      canvas.replaceElements([
        {
          type: 'rectangle',
          fillColor: color,
          strokeColor: color,
          frame: {
            x: 0,
            y: 0,
            w: 400,
            h: height,
          },
        },
      ]);
      canvas.show();
    }

    const canvas = hs.canvas.new({ x, y, w: 400, h: height });
    render();

    const state = {
      timer: hs.timer.doEvery(2, render),
    };

    return {
      bringToFront,
      destroy,
      hide,
      show,
    };
  }

  return {
    buildErrors: [],
    getWidth: () => 400,
    getWidget: getWindowList,
  };
};
