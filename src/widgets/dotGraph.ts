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

import { BLACK, WHITE } from 'src/constants';
import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';

export function getDotGraphBuilder(
  title: string,
  interval: number,
  maxValues: number,
  cmd: () => number
): WidgetBuildingInfo {
  const buildErrors: string[] = [];

  function getDotGraphWidget(
    { x, y, height, panelColor, panelHoverColor }: WidgetBuilderParams
  ) {
    function destroy() {
      canvas.delete();
    }

    function render() {
      const fontSize = 12;
      const titleY = height / 2 - fontSize - fontSize / 2;
      const graphY = titleY + fontSize * 1.5;
      const heightForGraph = height - graphY;

      state.values.push(cmd());

      state.values = state.values.slice(-1 * maxValues);
      const max = state.values.reduce((acc, v) => (v > acc ? v : acc), 0);

      const xScale = width / maxValues;
      const yScale = heightForGraph / max;

      const maxString = `${Math.ceil(max)}`;

      canvas.replaceElements([
        {
          type: 'rectangle',
          fillColor: panelHoverColor,
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
          textColor: BLACK,
          textSize: fontSize,
          frame: {
            x: 2,
            y: titleY,
            w: width,
            h: fontSize * 1.2,
          },
        },
        {
          type: 'points',
          coordinates: state.values.map((value, i) => ({
            x: i * xScale, y: graphY + heightForGraph - (value * yScale)
          }
          )),
          strokeColor: {red: 0, green: 1, blue: 1},
        },
        {
          // Max line
          type: 'segments',
          coordinates: [
            { x: 0, y: graphY },
            { x: width, y: graphY },
          ],
          strokeColor: { red: 1, green: 1, blue: 1},
          strokeWidth: 1,
        },
        {
          // Max label
          type: 'text',
          text: maxString,
          textAlignment: 'right',
          textColor: WHITE,
          textSize: fontSize * 0.8,
          frame: {
            x: 0,
            y: graphY - fontSize,
            w: width - 2,
            h: fontSize * 1.2
          },
        },
      ]);
      state.timer = hs.timer.doAfter(interval, render);
    }

    const state: {
      timer?: hs.TimerType
      values: number[]
    } = {
      values: [],
    };

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
    getWidget: getDotGraphWidget,
  };
};