// Copyright 2025 Glen Reesor
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
import type { WidgetLayout } from 'src/mainPanel';
import { WidgetConfig, State } from '../types';
import { getGraphLineSegments } from './getGraphLineSegments';
import { getGraphScaleFactors } from './getGraphScaleFactors';

export function renderMainGraph(args: {
  widgetLayout: WidgetLayout;
  widgetConfig: WidgetConfig;
  state: State;
  widgetWidth: number;
  mouseCallback: hs.canvas.CanvasMouseCallback;
}) {
  const {
    widgetLayout,
    widgetConfig: configParams,
    state,
    widgetWidth,
    mouseCallback,
  } = args;

  if (state.canvases.mainGraphCanvas === undefined) {
    const canvasX =
      widgetLayout.coords.leftX ?? widgetLayout.coords.rightX - widgetWidth;

    state.canvases.mainGraphCanvas = hs.canvas.new({
      x: canvasX,
      y: widgetLayout.coords.y,
      w: widgetWidth,
      h: widgetLayout.widgetHeight,
    });

    state.canvases.mainGraphCanvas.mouseCallback(mouseCallback);
    state.canvases.mainGraphCanvas.show();
  }

  const baseFontSize = 12;
  const fontSize = state.mouseButtonIsDown ? baseFontSize * 0.8 : baseFontSize;

  const titleY = widgetLayout.widgetHeight / 2 - fontSize - fontSize / 2;
  const bgColor = state.mouseIsInside
    ? { red: 120 / 255, green: 140 / 255, blue: 140 / 255 }
    : widgetLayout.panelHoverColor;

  const max =
    configParams.graphYMax ??
    state.yValues.reduce((acc, v) => (v > acc ? v : acc), 0);

  const graphTopLeft = {
    x: 0,
    y: titleY + fontSize * 1.3,
  };

  const graphDimensions = {
    w: widgetWidth,
    h: widgetLayout.widgetHeight - graphTopLeft.y,
  };

  const scale = getGraphScaleFactors({
    graphDimensions,
    maxYValue: max,
    numValues: configParams.maxValues,
    shrinkIfMouseButtonDown: true,
    mouseButtonIsDown: state.mouseButtonIsDown,
  });

  const currentValueString =
    state.yValues.length === 0
      ? ''
      : `${Math.round(state.yValues[state.yValues.length - 1])}`;

  const mainCanvasElements: hs.canvas.CanvasElement[] = [
    {
      type: 'rectangle',
      fillColor: bgColor,
      strokeColor: widgetLayout.panelColor,
      frame: {
        x: 0,
        y: 0,
        w: widgetWidth,
        h: widgetLayout.widgetHeight,
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
        w: widgetWidth,
        h: fontSize * 1.2,
      },
    },
    {
      // Max line
      type: 'segments',
      coordinates: [graphTopLeft, { x: widgetWidth, y: graphTopLeft.y }],
      strokeColor: { red: 0.8, green: 0.8, blue: 0.8 },
      strokeWidth: 1,
    },
    {
      // Max label
      type: 'text',
      text: currentValueString,
      textAlignment: 'right',
      textColor: WHITE,
      textSize: fontSize * 0.8,
      frame: {
        x: 0,
        y: graphTopLeft.y - fontSize,
        w: widgetWidth - 2,
        h: fontSize * 1.2,
      },
    },
  ];

  const graphLineSegments = getGraphLineSegments({
    bgColor: widgetLayout.panelHoverColor,
    graphDimensions,
    graphTopLeft,
    scale,
    strokeColor: { red: 0, green: 1, blue: 1 },
    yValues: state.yValues,
  });

  state.canvases.mainGraphCanvas?.replaceElements([
    ...mainCanvasElements,
    ...graphLineSegments,
  ]);
}
