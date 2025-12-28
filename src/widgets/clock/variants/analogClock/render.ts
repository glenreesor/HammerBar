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
const TICKMARK_LENGTH = 3;
const EDGE_TO_HOUR_HAND_PADDING =
  EDGE_TO_TICKMARKS_PADDING + TICKMARK_LENGTH + 5;
const EDGE_TO_MINUTE_HAND_PADDING =
  EDGE_TO_TICKMARKS_PADDING + TICKMARK_LENGTH - 2;
const EDGE_TO_SECOND_HAND_PADDING =
  EDGE_TO_TICKMARKS_PADDING + TICKMARK_LENGTH + 2;

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

  const clockOutlineElement = {
    type: 'circle',
    center: clockCenter,
    radius: clockRadius,
    strokeColor: BLACK,
    fillColor: BG_COLOR,
  };

  const clockCenterElement = {
    type: 'circle',
    center: clockCenter,
    radius: 1,
    strokeColor: BLACK,
    fillColor: { red: 0.5, green: 0.5, blue: 0.5 },
  };

  const tickMarks = getTickMarkElements({
    clockCenter,
    clockRadius,
    paddingToClockEdge: EDGE_TO_TICKMARKS_PADDING,
    tickLength: TICKMARK_LENGTH,
    multiplesOf: 5,
    color: { red: 0.5, green: 0.5, blue: 0.5 },
  });

  const hourHandLength = clockRadius - EDGE_TO_HOUR_HAND_PADDING;
  const minuteHandLength = clockRadius - EDGE_TO_MINUTE_HAND_PADDING;
  const secondHandLength = clockRadius - EDGE_TO_SECOND_HAND_PADDING;

  const hourHandElement = getHandElement({
    clockCenter,
    length: hourHandLength,
    angle: getAngle({ hour: hour + minute / 60 + second / 3600 }),
    color: BLACK,
  });

  const minuteHandElement = getHandElement({
    clockCenter,
    length: minuteHandLength,
    angle: getAngle({ minute: minute + second / 60 }),
    color: BLACK,
  });

  const secondHandElement = getHandElement({
    clockCenter,
    length: secondHandLength,
    angle: getAngle({ second }),
    color: { red: 1, green: 0, blue: 0 },
  });

  const elements = [
    clockOutlineElement,
    ...tickMarks,
    clockCenterElement,
    hourHandElement,
    minuteHandElement,
  ];

  if (widgetConfig.showSeconds) {
    elements.push(secondHandElement);
  }

  canvas.replaceElements(elements);
}

function getHandElement(args: {
  clockCenter: { x: number; y: number };
  length: number;
  angle: number;
  color: hs.canvas.Color;
}): hs.canvas.CanvasElement {
  const { clockCenter, length, angle, color } = args;
  const endCoords = getCoords({
    origin: clockCenter,
    distFromOrigin: length,
    angle,
  });

  return {
    type: 'segments',
    coordinates: [clockCenter, endCoords],
    strokeColor: color,
  };
}
