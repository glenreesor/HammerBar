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
import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/panel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from './helpers/util';

type ConfigParams = {
  title: string;
  interval: number;
  maxValues: number;
  maxGraphValue: number | undefined;
  cmd: () => number;
};

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    typeof (obj as ConfigParams).title === 'string' &&
    typeof (obj as ConfigParams).interval === 'number' &&
    typeof (obj as ConfigParams).maxValues === 'number' &&
    (typeof (obj as ConfigParams).maxGraphValue === 'number' ||
      typeof (obj as ConfigParams).maxGraphValue === 'undefined') &&
    typeof (obj as ConfigParams).cmd === 'function'
  );
}

export function getLineGraphBuilder(
  unvalidatedConfigParams: unknown,
): WidgetBuildingInfo {
  if (!isConfigParams(unvalidatedConfigParams)) {
    return getNoopWidgetBuildingInfo('LineGraph', [
      'Unexpected argument. Expecting an argument like this:',
      '',
      '  {',
      '    title = "The title",',
      '    interval = <a number>,',
      '    maxValues: <a number>,',
      '    maxGraphValue: <a number or nil>,',
      '    cmd = <a function that returns a number>,',
      '  }',
      '',
      'But instead this was received:',
      '',
      hs.inspect(unvalidatedConfigParams),
    ]);
  }

  // This looks goofy because the type checking should suffice since it
  // correctly narrows the type of unvalidatedBundleId.
  //
  // However it appears that typescript doesn't maintain that knowledge
  // within the function below.
  const configParams = unvalidatedConfigParams;

  function getLineGraphWidget({
    coords,
    height,
    panelColor,
    panelHoverColor,
  }: WidgetBuilderParams) {
    function cleanupPriorToDelete() {
      deleteCanvasesAndStopTimers(
        Object.values(state.canvases),
        Object.values(state.timers),
      );
    }

    function hide() {
      hideCanvases(Object.values(state.canvases));
    }

    function show() {
      showCanvases(Object.values(state.canvases));
    }

    const mouseCallback: hs.CanvasMouseCallbackType = function (
      this: void,
      _canvas: hs.CanvasType,
      msg: 'mouseEnter' | 'mouseExit' | 'mouseDown' | 'mouseUp',
    ) {
      if (msg === 'mouseEnter') {
        state.mouseIsInside = true;
        updateShowHoverValue();
        render();
      } else if (msg === 'mouseExit') {
        state.mouseIsInside = false;
        updateShowHoverValue();
        render();
      } else if (msg === 'mouseDown') {
        state.mouseButtonIsDown = true;
        render();
      } else if (msg === 'mouseUp') {
        state.mouseButtonIsDown = false;
        state.renderExpandedView = !state.renderExpandedView;

        if (
          !state.renderExpandedView &&
          state.canvases.expandedViewCanvas !== undefined
        ) {
          state.canvases.expandedViewCanvas.hide();
          state.canvases.expandedViewCanvas = undefined;
        }

        if (state.renderExpandedView) {
          renderExpandedView();
        }

        updateShowHoverValue();
        render();
      }
    };

    function updateShowHoverValue() {
      state.renderHoverValue = state.mouseIsInside && !state.renderExpandedView;
      if (state.renderHoverValue) {
        renderHoverValue();
      }
      if (!state.renderHoverValue && state.canvases.hoverCanvas !== undefined) {
        state.canvases.hoverCanvas.hide();
        state.canvases.hoverCanvas = undefined;
      }
    }

    function getGraphLineSegments(args: {
      bgColor: hs.ColorType;
      graphDimensions: { w: number; h: number };
      graphTopLeft: { x: number; y: number };
      scale: { x: number; y: number };
      strokeColor: hs.ColorType;
    }): hs.CanvasElementType[] {
      const { bgColor, graphDimensions, graphTopLeft, scale, strokeColor } =
        args;

      return [
        {
          type: 'segments',
          coordinates: state.values.map((value, i) => ({
            x: graphTopLeft.x + i * scale.x,
            y: graphTopLeft.y + graphDimensions.h - value * scale.y,
          })),
          fillColor: bgColor,
          strokeColor,
        },
      ];
    }

    function getGraphScaleFactors(args: {
      graphDimensions: { w: number; h: number };
      maxYValue: number;
      numValues: number;
      shrinkIfMouseButtonDown: boolean;
    }): { x: number; y: number } {
      const { graphDimensions, maxYValue, numValues, shrinkIfMouseButtonDown } =
        args;

      const baseXScale = graphDimensions.w / numValues;
      const xScale =
        shrinkIfMouseButtonDown && state.mouseButtonIsDown
          ? baseXScale * 0.8
          : baseXScale;

      const baseYScale = graphDimensions.h / maxYValue;
      const yScale =
        shrinkIfMouseButtonDown && state.mouseButtonIsDown
          ? baseYScale * 0.8
          : baseYScale;

      return { x: xScale, y: yScale };
    }

    function getHorizontalScaleLineWithLabel(args: {
      graphDimensions: { w: number; h: number };
      graphTopLeft: { x: number; y: number };
      scale: { x: number; y: number };
      value: number;
    }): hs.CanvasElementType[] {
      const { graphDimensions, graphTopLeft, scale, value } = args;

      const fontSize = 12;
      const y = Math.round(
        graphTopLeft.y + graphDimensions.h - value * scale.y,
      );
      const label = `${Math.round(value)}`;

      return [
        {
          type: 'segments',
          coordinates: [
            {
              x: graphTopLeft.x - 5,
              y,
            },
            {
              x: graphTopLeft.x + graphDimensions.w,
              y,
            },
          ],
          strokeColor: { red: 0.8, green: 0.8, blue: 0.8 },
          strokeWidth: 1,
        },
        {
          type: 'text',
          text: label,
          textColor: { red: 0.8, green: 0.8, blue: 0.8 },
          textSize: fontSize * 0.8,
          frame: {
            x: 4,
            y: y - fontSize / 2,
            w: graphDimensions.w,
            h: fontSize * 1.2,
          },
        },
      ];
    }

    function render() {
      const baseFontSize = 12;
      const fontSize = state.mouseButtonIsDown
        ? baseFontSize * 0.8
        : baseFontSize;

      const titleY = height / 2 - fontSize - fontSize / 2;
      const bgColor = state.mouseIsInside
        ? { red: 120 / 255, green: 140 / 255, blue: 140 / 255 }
        : panelHoverColor;

      const max =
        configParams.maxGraphValue ??
        state.values.reduce((acc, v) => (v > acc ? v : acc), 0);

      const graphTopLeft = {
        x: 0,
        y: titleY + fontSize * 1.3,
      };

      const graphDimensions = {
        w: width,
        h: height - graphTopLeft.y,
      };

      const scale = getGraphScaleFactors({
        graphDimensions,
        maxYValue: max,
        numValues: configParams.maxValues,
        shrinkIfMouseButtonDown: true,
      });

      const maxString = `${Math.round(max)}`;

      const mainCanvasElements: hs.CanvasElementType[] = [
        {
          type: 'rectangle',
          fillColor: bgColor,
          strokeColor: panelColor,
          frame: {
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
          trackMouseEnterExit: true,
          trackMouseDown: true,
          trackMouseUp: true,
        },
        {
          type: 'text',
          text: configParams.title,
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
          // Max line
          type: 'segments',
          coordinates: [graphTopLeft, { x: width, y: graphTopLeft.y }],
          strokeColor: { red: 1, green: 1, blue: 1 },
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
            y: graphTopLeft.y - fontSize,
            w: width - 2,
            h: fontSize * 1.2,
          },
        },
      ];

      const graphLineSegments = getGraphLineSegments({
        bgColor: panelHoverColor,
        graphDimensions,
        graphTopLeft,
        scale,
        strokeColor: { red: 0, green: 1, blue: 1 },
      });

      state.canvases.graphCanvas?.replaceElements([
        ...mainCanvasElements,
        ...graphLineSegments,
      ]);
    }

    function renderExpandedView() {
      const expandedViewHeight = 150;
      const expandedViewWidth = 150;

      if (state.canvases.expandedViewCanvas === undefined) {
        state.canvases.expandedViewCanvas = hs.canvas.new({
          x: coords.x - expandedViewWidth + width,
          y: coords.y - expandedViewHeight,
          w: expandedViewWidth,
          h: expandedViewHeight,
        });
        state.canvases.expandedViewCanvas.show();
      }

      const fontSize = 12;
      const titleY = fontSize;

      const max =
        configParams.maxGraphValue ??
        state.values.reduce((acc, v) => (v > acc ? v : acc), 0);

      const currentValue = state.values[state.values.length - 1];

      const graphTopLeft = {
        x: fontSize * `${Math.round(max)}`.length,
        y: titleY + fontSize * 2,
      };

      const indicatorBarHeight = 2;
      const indicatorBarPadding = 2;

      const graphDimensions = {
        w: expandedViewWidth - graphTopLeft.x,
        h:
          expandedViewHeight -
          graphTopLeft.y -
          indicatorBarHeight -
          indicatorBarPadding,
      };

      const scale = getGraphScaleFactors({
        graphDimensions,
        maxYValue: max,
        numValues: configParams.maxValues,
        shrinkIfMouseButtonDown: false,
      });

      const currentValueString = `${Math.round(currentValue)}`;

      const mainCanvasElements: hs.CanvasElementType[] = [
        {
          type: 'rectangle',
          fillColor: { red: 0.5, green: 0.5, blue: 0.5 },
          strokeColor: { red: 0.4, green: 0.4, blue: 0.4 },
          frame: {
            x: 0,
            y: 0,
            w: expandedViewWidth,
            h: expandedViewHeight,
          },
          roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
        },
        {
          // Indicator bar over regular canvas
          type: 'rectangle',
          fillColor: { red: 0, green: 0, blue: 1 },
          strokeColor: { red: 0, green: 0, blue: 1 },
          frame: {
            x: expandedViewWidth - width,
            y: expandedViewHeight - indicatorBarHeight,
            w: width,
            h: indicatorBarHeight,
          },
          roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
        },
        {
          // Title
          type: 'text',
          text: configParams.title,
          textColor: BLACK,
          textSize: fontSize,
          frame: {
            x: 4,
            y: titleY,
            w: expandedViewWidth,
            h: fontSize * 1.2,
          },
        },
        {
          // Current value
          type: 'text',
          text: currentValueString,
          textAlignment: 'right',
          textColor: WHITE,
          textSize: fontSize,
          frame: {
            x: 0,
            y: titleY,
            w: expandedViewWidth / 2,
            h: fontSize * 1.2,
          },
        },
      ];

      const graphLineSegments = getGraphLineSegments({
        bgColor: { red: 0.5, green: 0.5, blue: 0.5 },
        graphDimensions,
        graphTopLeft,
        scale,
        strokeColor: { red: 0, green: 1, blue: 1 },
      });

      const horizontalScaleLinesWithLabels = [0, 0.25, 0.5, 0.75, 1].flatMap(
        (fractionOfMax) => {
          return getHorizontalScaleLineWithLabel({
            graphDimensions,
            graphTopLeft,
            scale,
            value: fractionOfMax * max,
          });
        },
      );

      state.canvases.expandedViewCanvas.replaceElements([
        ...mainCanvasElements,
        ...graphLineSegments,
        ...horizontalScaleLinesWithLabels,
      ]);
    }

    function renderHoverValue() {
      const fontSize = 10;
      const value = state.values[state.values.length - 1];
      const canvasX = coords.x;
      const hoverWidth = fontSize * (value.toString().length + 1);
      const hoverHeight = fontSize * 2;

      if (state.canvases.hoverCanvas === undefined) {
        state.canvases.hoverCanvas = hs.canvas.new({
          x: canvasX,
          y: coords.y - hoverHeight - 2,
          w: width,
          h: hoverHeight,
        });
      }

      state.canvases.hoverCanvas.replaceElements([
        {
          type: 'rectangle',
          fillColor: WHITE,
          frame: {
            x: 0,
            y: 0,
            w: hoverWidth,
            h: hoverHeight,
          },
          roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
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
      ]);
      state.canvases.hoverCanvas.show();
    }

    function runCmdAndRender() {
      state.values.push(configParams.cmd());
      state.values = state.values.slice(-1 * configParams.maxValues);
      render();

      if (state.renderHoverValue) {
        renderHoverValue();
      }

      if (state.renderExpandedView) {
        renderExpandedView();
      }

      state.timers.timer = hs.timer.doAfter(
        configParams.interval,
        runCmdAndRender,
      );
    }

    const state: {
      canvases: {
        expandedViewCanvas: hs.CanvasType | undefined;
        graphCanvas: hs.CanvasType | undefined;
        hoverCanvas: hs.CanvasType | undefined;
      };
      timers: {
        timer: hs.TimerType | undefined;
      };
      mouseButtonIsDown: boolean;
      mouseIsInside: boolean;
      renderExpandedView: boolean;
      renderHoverValue: boolean;
      values: number[];
    } = {
      canvases: {
        expandedViewCanvas: undefined,
        graphCanvas: undefined,
        hoverCanvas: undefined,
      },
      timers: {
        timer: undefined,
      },
      mouseButtonIsDown: false,
      mouseIsInside: false,
      renderExpandedView: false,
      renderHoverValue: false,
      values: [],
    };

    const width = height * 1.5;
    state.canvases.graphCanvas = hs.canvas.new({
      x: coords.x,
      y: coords.y,
      w: width,
      h: height,
    });

    runCmdAndRender();
    state.canvases.graphCanvas.mouseCallback(mouseCallback);
    state.canvases.graphCanvas.show();

    return {
      bringToFront: () => state.canvases.graphCanvas?.show(),
      cleanupPriorToDelete,
      hide: hide,
      show: show,
    };
  }

  return {
    buildErrors: [],
    name: 'LineGraph',
    getWidth: (widgetHeight) => widgetHeight * 1.5,
    getWidget: getLineGraphWidget,
  };
}
