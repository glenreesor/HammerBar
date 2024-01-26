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

export function getLineGraphBuilder(
  title: string,
  interval: number,
  maxValues: number,
  maxGraphValue: number | undefined,
  cmd: () => number
): WidgetBuildingInfo {
  const buildErrors: string[] = [];

  function getLineGraphWidget(
    { x, y, height, panelColor, panelHoverColor }: WidgetBuilderParams
  ) {
    function destroy() {
      canvas.hide();
      canvas.delete();

      if (state.hoverCanvas !== undefined) {
        state.hoverCanvas.hide();
        state.hoverCanvas.delete();
      }
    }

    const mouseCallback: hs.CanvasMouseCallbackType = function(
      this: void,
      _canvas: hs.CanvasType,
      msg: 'mouseEnter' | 'mouseExit' | 'mouseDown' | 'mouseUp',
    ) {
      if (msg === 'mouseEnter') {
        state.mouseIsInside = true;
        render();
      } else if (msg === 'mouseExit') {
        state.mouseIsInside = false;
        render();
      }
    }


    function renderHoveredValue() {
      const fontSize = 10;
      const value = state.values[state.values.length - 1];
      const canvasX = state.values.length < maxValues / 2
        ? x + width / 2
        : x + 5;
      const hoverWidth = fontSize * (value.toString().length + 1);
      const hoverHeight= fontSize * 2;

      if (state.hoverCanvas === undefined) {
        state.hoverCanvas = hs.canvas.new({
          x: canvasX,
          y: y + height / 2 - hoverHeight / 2,
          w: hoverWidth,
          h: hoverHeight,
        });
      }

      state.hoverCanvas.replaceElements(
        [
          {
            type: 'rectangle',
            fillColor: WHITE,
            frame: {
              x: 0,
              y: 0,
              w: hoverWidth,
              h: hoverHeight,
            },
          },
          {
            type: 'text',
            text: `${value}`,
            textColor: BLACK,
            textSize: fontSize,
            textAlignment: 'center',
            frame: {
              x: 0,
              y: 5,
              w: hoverWidth,
              h: hoverHeight,
            },
          },
        ],
      );
      state.hoverCanvas.show();
    }

    function render() {
      const fontSize = 12;
      const titleY = height / 2 - fontSize - fontSize / 2;
      const graphY = titleY + fontSize * 1.5;
      const heightForGraph = height - graphY;

      state.values.push(cmd());

      state.values = state.values.slice(-1 * maxValues);
      const max = maxGraphValue ?? state.values.reduce((acc, v) => (v > acc ? v : acc), 0);

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
          trackMouseEnterExit: true,
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
          type: 'segments',
          coordinates: state.values.map((value, i) => ({
            x: i * xScale, y: graphY + heightForGraph - (value * yScale)
          }
          )),
          fillColor: panelHoverColor,
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

      if (state.mouseIsInside) {
        renderHoveredValue();
      } else {
        if (state.hoverCanvas !== undefined) {
          state.hoverCanvas.hide();
          state.hoverCanvas = undefined;
        }
      }
    }

    const state: {
      hoverCanvas: hs.CanvasType | undefined,
      mouseIsInside: boolean,
      timer?: hs.TimerType
      values: number[]
    } = {
      hoverCanvas: undefined,
      mouseIsInside: false,
      values: [],
    };

    const width = height * 1.5;
    const canvas = hs.canvas.new({ x, y, w: width, h: height });

    render();
    canvas.mouseCallback(mouseCallback);
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
    getWidget: getLineGraphWidget,
  };
};
