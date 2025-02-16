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

export function getGraphScaleFactors(args: {
  graphDimensions: { w: number; h: number };
  maxYValue: number;
  numValues: number;
  shrinkIfMouseButtonDown: boolean;
  mouseButtonIsDown: boolean;
}): { x: number; y: number } {
  const {
    graphDimensions,
    maxYValue,
    numValues,
    shrinkIfMouseButtonDown,
    mouseButtonIsDown,
  } = args;

  const baseXScale = graphDimensions.w / numValues;
  const xScale =
    shrinkIfMouseButtonDown && mouseButtonIsDown
      ? baseXScale * 0.8
      : baseXScale;

  const baseYScale = graphDimensions.h / maxYValue;
  const yScale =
    shrinkIfMouseButtonDown && mouseButtonIsDown
      ? baseYScale * 0.8
      : baseYScale;

  return { x: xScale, y: yScale };
}
