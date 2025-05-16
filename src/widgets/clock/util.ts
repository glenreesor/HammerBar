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

export function getAngle(
  args: { hour: number } | { minute: number } | { second: number },
) {
  const valueOutOf60 =
    'hour' in args
      ? args.hour * 5
      : 'minute' in args
        ? args.minute
        : args.second;

  const valueInRadians = (valueOutOf60 / 60) * 2 * Math.PI;

  // Angles in standard position:
  //  - sweep out counterclockwise, so * -1
  //  - 0 is at 3 o'clock, so + Math.PI / 2
  const valueStandardPosition = -1 * valueInRadians + Math.PI / 2;

  return valueStandardPosition;
}

export function getCoords(args: {
  origin: { x: number; y: number };
  distFromOrigin: number;
  angle: number;
}) {
  const { origin, distFromOrigin: radius, angle } = args;

  const x = origin.x + radius * Math.cos(angle);

  // Hammerspoon y coordinates increase going down, rather than up, hence `-`
  const y = origin.y - radius * Math.sin(angle);

  return { x, y };
}

export function getTickMarkElements(args: {
  clockCenter: { x: number; y: number };
  clockRadius: number;
  paddingToClockEdge: number;
  tickLength: number;
  multiplesOf: number;
  color: hs.canvas.Color;
}): hs.canvas.CanvasElement[] {
  const {
    clockCenter,
    clockRadius,
    paddingToClockEdge,
    tickLength,
    multiplesOf,
    color,
  } = args;

  const elements: hs.canvas.CanvasElement[] = [];

  let minute = 0;
  while (minute < 60) {
    const coordsStart = getCoords({
      origin: clockCenter,
      distFromOrigin: clockRadius - paddingToClockEdge - tickLength,
      angle: getAngle({ minute }),
    });

    const coordsEnd = getCoords({
      origin: clockCenter,
      distFromOrigin: clockRadius - paddingToClockEdge,
      angle: getAngle({ minute }),
    });

    elements.push({
      type: 'segments',
      coordinates: [coordsStart, coordsEnd],
      strokeColor: color,
    });

    minute += multiplesOf;
  }

  return elements;
}
