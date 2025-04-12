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
import type { State } from './types';

export function renderHoverWindowTitle(state: State) {
  const fontSize = 12;
  const width = state.windowState.title.length * fontSize * 0.75;
  const height = fontSize * 2;

  if (state.canvases.hoverCanvas === undefined) {
    state.canvases.hoverCanvas = hs.canvas.new({
      x: state.buttonGeometry.x,
      y: state.buttonGeometry.y - fontSize * 2,
      w: width,
      h: height,
    });
  }
  state.canvases.hoverCanvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: { red: 1, green: 1, blue: 1 },
      frame: {
        x: 0,
        y: 0,
        w: width,
        h: height,
      },
      roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
    },
    {
      type: 'text',
      text: state.windowState.title,
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: 10,
        y: 5,
        w: width,
        h: height,
      },
    },
  ]);
  state.canvases.hoverCanvas.show();
}
