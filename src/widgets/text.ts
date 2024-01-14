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

import { BLACK } from 'src/constants';
import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';

export function getTextBuilder(title: string, interval: number, cmd: () => string): WidgetBuildingInfo {
  const buildErrors: string[] = [];

  function getTextWidget(
    { x, y, height, panelColor }: WidgetBuilderParams
  ) {
    function destroy() {
      canvas.delete();
    }

    function render() {
      const fontSize = 12;
      const titleY = height / 2 - fontSize - fontSize / 2;
      const outputY = titleY + fontSize * 1.6;

      const output = cmd();

      canvas.replaceElements(
        [
          {
            type: 'rectangle',
            fillColor: panelColor,
            strokeColor: panelColor,
            frame: {
              x: 0,
              y: 0,
              w: width,
              h: height,
            },
          },
          {
            type: 'text',
            text: title,
            textAlignment: 'center',
            textColor: BLACK,
            textSize: fontSize,
            frame: {
              x: 0,
              y: titleY,
              w: width,
              h: fontSize * 1.2,
            },
          },
          {
            type: 'text',
            text: output,
            textAlignment: 'center',
            textColor: BLACK,
            textSize: fontSize,
            frame: {
              x: 0,
              y: outputY,
              w: width,
              h: fontSize * 1.2,
            },
          },
        ],
      );

      state.timer = hs.timer.doAfter(interval, render);
    }

    const state: { timer?: hs.TimerType } = { };

    const width = height * 1.5;
    const canvas = hs.canvas.new({ x, y, w: width, h: height });

    render();
    canvas.show();

    return {
      bringToFront: () => canvas.show(),
      destroy,
      hide: () => canvas.hide(),
      show: () => canvas.show(),
    };
  }

  return {
    buildErrors,
    getWidth: (widgetHeight) => widgetHeight * 1.5,
    getWidget: getTextWidget,
  };
};
