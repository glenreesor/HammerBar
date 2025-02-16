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

export function getGraphLineSegments(args: {
  bgColor: hs.canvas.ColorType;
  graphDimensions: { w: number; h: number };
  graphTopLeft: { x: number; y: number };
  scale: { x: number; y: number };
  strokeColor: hs.canvas.ColorType;
  stateValues: number[];
}): hs.canvas.CanvasElementType[] {
  const {
    bgColor,
    graphDimensions,
    graphTopLeft,
    scale,
    strokeColor,
    stateValues,
  } = args;

  return [
    {
      type: 'segments',
      coordinates: stateValues.map((value, i) => ({
        x: graphTopLeft.x + i * scale.x,
        y: graphTopLeft.y + graphDimensions.h - value * scale.y,
      })),
      fillColor: bgColor,
      strokeColor,
    },
  ];
}
