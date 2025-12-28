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

import { BLACK } from 'src/constants';
import type { WidgetConfig } from './types';
import { getAngle, getCoords, getTickMarkElements } from '../../util';

const BG_COLOR = { red: 1, green: 1, blue: 1 };

const EDGE_TO_TICKMARKS_PADDING = 1;
const TICKMARKS_TO_MOVING_CIRCLES_PADDING = 2;
const TICKMARK_LENGTH = 3;
const MINUTE_TO_HOUR_CIRCLE_PADDING = 2;

const HOUR_CIRCLE_RADIUS = 1;
const MINUTE_CIRCLE_RADIUS = 1.5;
const SECOND_CIRCLE_RADIUS = 1;

export function render(args: {
  widgetConfig: WidgetConfig;
  canvas: hs.canvas.Canvas;
  width: number;
  height: number;
}) {
  const { widgetConfig, canvas, width, height } = args;

  const clockRadius = Math.min(width / 2, height / 2) - 2;

  const clockCenter = {
    x: clockRadius + 2,
    y: clockRadius + 1,
  };

  const now = os.date('*t') as os.DateTable;
  const hour = now.hour < 13 ? now.hour : now.hour - 12;
  const minute = now.min;
  const second = now.sec;

  const hourDistFromOrigin =
    clockRadius -
    EDGE_TO_TICKMARKS_PADDING -
    TICKMARK_LENGTH -
    TICKMARKS_TO_MOVING_CIRCLES_PADDING -
    2 * MINUTE_CIRCLE_RADIUS -
    MINUTE_TO_HOUR_CIRCLE_PADDING -
    HOUR_CIRCLE_RADIUS;

  const minuteDistFromOrigin =
    clockRadius -
    EDGE_TO_TICKMARKS_PADDING -
    TICKMARK_LENGTH -
    TICKMARKS_TO_MOVING_CIRCLES_PADDING -
    MINUTE_CIRCLE_RADIUS;

  const secondDistFromOrigin = hourDistFromOrigin;

  const clockOutlineElement = {
    type: 'circle',
    center: clockCenter,
    radius: clockRadius,
    strokeColor: BLACK,
    fillColor: BG_COLOR,
  };

  const hourCirclePathElement = {
    type: 'circle',
    center: clockCenter,
    radius: hourDistFromOrigin,
    strokeColor: { red: 0.5, green: 0.5, blue: 0.5 },
    fillColor: BG_COLOR,
  };

  const minuteCirclePathElement = {
    type: 'circle',
    center: clockCenter,
    radius: minuteDistFromOrigin,
    strokeColor: { red: 0.5, green: 0.5, blue: 0.5 },
    fillColor: BG_COLOR,
  };

  const tickMarks = getTickMarkElements({
    clockCenter,
    clockRadius,
    paddingToClockEdge: EDGE_TO_TICKMARKS_PADDING,
    tickLength: TICKMARK_LENGTH,
    multiplesOf: 5,
    color: { red: 0.5, green: 0.5, blue: 0.5 },
  });

  const hourCircleElement = getCircleElement({
    clockCenter,
    distFromOrigin: hourDistFromOrigin,
    angle: getAngle({ hour: hour + minute / 60 + second / 3600 }),
    circleRadius: HOUR_CIRCLE_RADIUS,
    color: BLACK,
  });

  const minuteCircleElement = getCircleElement({
    clockCenter,
    distFromOrigin: minuteDistFromOrigin,
    angle: getAngle({ minute: minute + second / 60 }),
    circleRadius: MINUTE_CIRCLE_RADIUS,
    color: BLACK,
  });

  const secondCircleElement = getCircleElement({
    clockCenter,
    distFromOrigin: secondDistFromOrigin,
    angle: getAngle({ second }),
    circleRadius: SECOND_CIRCLE_RADIUS,
    color: { red: 1, green: 0, blue: 0 },
  });

  // Note the order of canvas elements (lowest to highest)
  const elements: hs.canvas.CanvasElement[] = [clockOutlineElement];

  if (widgetConfig.showCirclePaths) {
    elements.push(...[minuteCirclePathElement, hourCirclePathElement]);
  }

  elements.push(...[...tickMarks, minuteCircleElement, hourCircleElement]);

  if (widgetConfig.showSeconds) {
    elements.push(secondCircleElement);
  }

  canvas.replaceElements(elements);
}

function getCircleElement(args: {
  clockCenter: { x: number; y: number };
  distFromOrigin: number;
  angle: number;
  circleRadius: number;
  color: hs.canvas.Color;
}): hs.canvas.CanvasElement {
  const { clockCenter, distFromOrigin, angle, circleRadius, color } = args;
  const center = getCoords({
    origin: clockCenter,
    distFromOrigin,
    angle,
  });

  return {
    type: 'circle',
    center,
    radius: circleRadius,
    strokeWidth: 0,
    strokeColor: color,
    fillColor: color,
  };
}
