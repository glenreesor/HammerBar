// Copyright 2026 Glen Reesor
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

import { getTheme } from 'src/theme';
import { TOGGLE_BUTTON_WIDTH } from './constants';

export function addBorders(panelGeometry: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
}) {
  const theme = getTheme();
  const borderWidth = theme.panelBorder.width;
  const borderColor = theme.panelBorder.color;

  function prepareForRemoval() {
    state.canvas?.hide();
    state.canvas = undefined;
  }

  function setPanelVisibility(isVisible: boolean) {
    state.panelIsVisible = isVisible;
    render();
  }

  function renderToggleButtonsBorders() {
    state.canvas?.replaceElements([
      // Left toggle button borders
      ...getRectangularBorderElements({
        x: 0,
        dimensions: {
          h: panelGeometry.dimensions.h,
          w: TOGGLE_BUTTON_WIDTH + 2 * borderWidth,
        },
      }),

      // Right toggle button borders
      ...getRectangularBorderElements({
        x: panelGeometry.dimensions.w - 2 * borderWidth - TOGGLE_BUTTON_WIDTH,
        dimensions: {
          h: panelGeometry.dimensions.h,
          w: TOGGLE_BUTTON_WIDTH + 2 * borderWidth,
        },
      }),
    ]);
  }

  function renderFullPanelBorder() {
    state.canvas?.replaceElements([
      ...getRectangularBorderElements({
        x: 0,
        dimensions: panelGeometry.dimensions,
      }),
    ]);
  }

  function getRectangularBorderElements(outerGeometry: {
    x: number;
    dimensions: { w: number; h: number };
  }): hs.canvas.CanvasElement[] {
    const { x, dimensions } = outerGeometry;

    // Note we don't overlap any of the borders since that would result
    // in different shades when alpha is not 1.
    //
    // Top and bottom are full width, left and right go *between* top
    // and bottom
    return [
      // Top (Full Width)
      {
        type: 'rectangle',
        action: 'fill',
        frame: {
          x,
          y: 0,
          w: dimensions.w,
          h: borderWidth,
        },
        fillColor: borderColor,
      },

      // Bottom (Full Width)
      {
        type: 'rectangle',
        action: 'fill',
        frame: {
          x,
          y: dimensions.h - borderWidth,
          w: dimensions.w,
          h: borderWidth,
        },
        fillColor: borderColor,
      },

      // Left (Between top and bottom)
      {
        type: 'rectangle',
        action: 'fill',
        frame: {
          x,
          y: borderWidth,
          w: borderWidth,
          h: dimensions.h - 2 * borderWidth,
        },
        fillColor: borderColor,
      },

      // Right (Between top and bottom)
      {
        type: 'rectangle',
        action: 'fill',
        frame: {
          x: x + dimensions.w - borderWidth,
          y: borderWidth,
          w: borderWidth,
          h: dimensions.h - 2 * borderWidth,
        },
        fillColor: borderColor,
      },
    ];
  }

  function render() {
    if (state.panelIsVisible) {
      renderFullPanelBorder();
    } else {
      renderToggleButtonsBorders();
    }
  }

  const state: {
    canvas: hs.canvas.Canvas | undefined;
    panelIsVisible: boolean;
  } = {
    canvas: undefined,
    panelIsVisible: true,
  };

  state.canvas = hs.canvas.new({
    x: panelGeometry.coords.x,
    y: panelGeometry.coords.y,
    h: panelGeometry.dimensions.h,
    w: panelGeometry.dimensions.w,
  });

  state.canvas.alpha(theme.panelBorder.alpha);
  render();

  state.canvas.show();

  return {
    prepareForRemoval,
    setPanelVisibility,
  };
}
