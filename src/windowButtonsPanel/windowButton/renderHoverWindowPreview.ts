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

export function renderHoverWindowPreview(state: State) {
  const fontSize = 12;
  const canvasWidth = 300;
  const canvasHeight = 300;
  const padding = 10;
  const previewY = padding + fontSize * 1.5;

  if (state.canvases.hoverCanvas === undefined) {
    state.canvases.hoverCanvas = hs.canvas.new({
      x: state.buttonGeometry.x,
      y: state.buttonGeometry.y - canvasHeight,
      w: canvasWidth,
      h: canvasHeight,
    });
  }

  let windowSnapshot: hs.image.ImageType;
  if (state.windowState.isMinimized) {
    // If we're minimized, MacOS returns an empty image for the snapshot, so
    // use our cached one instead
    windowSnapshot = state.windowSnapshot;
  } else {
    // Use a fresh one and save it to be after next time we're minimized
    windowSnapshot = state.windowObject.snapshot();
    state.windowSnapshot = windowSnapshot;
  }

  state.canvases.hoverCanvas.replaceElements([
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
      text: state.windowState.title,
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: padding,
        y: 5,
        w: canvasWidth - 2 * padding,
        h: fontSize * 1.5,
      },
    },
    {
      type: 'image',
      frame: {
        x: padding,
        y: previewY,
        w: canvasWidth - 2 * padding,
        h: canvasHeight - previewY - padding,
      },
      image: windowSnapshot,
    },
  ]);
  state.canvases.hoverCanvas.show();
}
