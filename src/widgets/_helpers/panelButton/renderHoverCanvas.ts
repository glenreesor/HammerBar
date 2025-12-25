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

export function renderHoverCanvas(args: {
  canvases: { hoverCanvas: hs.canvas.Canvas | undefined };
  buttonGeometry: { x: number; y: number };
  hoverText: string;
}) {
  const fontSize = 12;
  const canvasWidth = fontSize * args.hoverText.length;
  const padding = 4;
  const canvasHeight = fontSize * 1.2 + 2 * padding;

  if (args.canvases.hoverCanvas === undefined) {
    args.canvases.hoverCanvas = hs.canvas.new({
      x: args.buttonGeometry.x,
      y: args.buttonGeometry.y - canvasHeight,
      w: canvasWidth,
      h: canvasHeight,
    });
  }

  args.canvases.hoverCanvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: { red: 1, green: 1, blue: 1 },
      frame: {
        x: 0,
        y: 0,
        w: canvasWidth,
        h: canvasHeight,
      },
      roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
    },
    {
      type: 'text',
      text: args.hoverText,
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: padding,
        y: padding,
        w: canvasWidth - 2 * padding,
        h: fontSize * 1.5,
      },
    },
  ]);
  args.canvases.hoverCanvas.show();
}
