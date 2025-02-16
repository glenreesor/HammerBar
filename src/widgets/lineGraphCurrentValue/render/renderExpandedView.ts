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
import type { WidgetBuilderParams } from 'src/mainPanel';
import { ConfigParams, State } from '../types';
import { getGraphLineSegments } from './getGraphLineSegments';
import { getGraphScaleFactors } from './getGraphScaleFactors';

export function renderExpandedView(args: {
  builderParams: WidgetBuilderParams;
  configParams: ConfigParams;
  state: State;
  widgetWidth: number;
}) {
  const { builderParams, configParams, state, widgetWidth } = args;

  const expandedViewHeight = 150;
  const expandedViewWidth = 150;
  const canvasX =
    builderParams.coords.leftX ??
    builderParams.coords.rightX - expandedViewWidth;

  if (state.canvases.expandedViewCanvas === undefined) {
    state.canvases.expandedViewCanvas = hs.canvas.new({
      x: canvasX,
      y: builderParams.coords.y - expandedViewHeight,
      w: expandedViewWidth,
      h: expandedViewHeight,
    });
    state.canvases.expandedViewCanvas.show();
  }

  const fontSize = 12;
  const titleY = fontSize;

  const maxY =
    configParams.graphYMax ??
    state.yValues.reduce((acc, v) => (v > acc ? v : acc), 0);

  const currentValue = state.yValues[state.yValues.length - 1];

  const graphTopLeft = {
    x: fontSize * `${Math.round(maxY)}`.length,
    y: titleY + fontSize * 2,
  };

  const indicatorBarHeight = 2;
  const indicatorBarPadding = 6;

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
    maxYValue: maxY,
    numValues: configParams.maxValues,
    shrinkIfMouseButtonDown: false,
    mouseButtonIsDown: state.mouseButtonIsDown,
  });

  const currentValueString = `${Math.round(currentValue)}`;

  const mainCanvasElements: hs.canvas.CanvasElementType[] = [
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
        x:
          builderParams.coords.leftX !== undefined
            ? 0
            : expandedViewWidth - widgetWidth,
        y: expandedViewHeight - indicatorBarHeight,
        w: widgetWidth,
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
        w: expandedViewWidth - 4,
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
    yValues: state.yValues,
  });

  const horizontalScaleLinesWithLabels = [0, 0.25, 0.5, 0.75, 1].flatMap(
    (fractionOfMax) => {
      return getHorizontalScaleLineWithLabel({
        graphDimensions,
        graphTopLeft,
        scale,
        value: fractionOfMax * maxY,
      });
    },
  );

  state.canvases.expandedViewCanvas.replaceElements([
    ...mainCanvasElements,
    ...graphLineSegments,
    ...horizontalScaleLinesWithLabels,
  ]);
}

function getHorizontalScaleLineWithLabel(args: {
  graphDimensions: { w: number; h: number };
  graphTopLeft: { x: number; y: number };
  scale: { x: number; y: number };
  value: number;
}): hs.canvas.CanvasElementType[] {
  const { graphDimensions, graphTopLeft, scale, value } = args;

  const fontSize = 12;
  const y = Math.round(graphTopLeft.y + graphDimensions.h - value * scale.y);
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
