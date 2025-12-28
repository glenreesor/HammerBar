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
import { State } from '../types';

export function renderHoverValue(args: {
  widgetLayout: WidgetLayout;
  state: State;
  widgetWidth: number;
}) {
  const { widgetLayout, state, widgetWidth } = args;

  const fontSize = 10;
  const value = state.yValues[state.yValues.length - 1];
  const canvasX =
    widgetLayout.coords.leftX ?? widgetLayout.coords.rightX - widgetWidth;
  const hoverWidth = fontSize * (value.toString().length + 1);
  const hoverHeight = fontSize * 2;

  if (state.canvases.hoverCanvas === undefined) {
    state.canvases.hoverCanvas = hs.canvas.new({
      x: canvasX,
      y: widgetLayout.coords.y - hoverHeight - 2,
      w: widgetWidth,
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
