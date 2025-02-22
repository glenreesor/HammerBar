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

import { DEFAULT_THEME } from 'src/theme';

export default function PanelBorders(args: {
  panelX: number;
  panelY: number;
  panelWidth: number;
  panelHeight: number;
}) {
  const { panelX, panelY, panelWidth, panelHeight } = args;
  const borderWidth = DEFAULT_THEME.panelBorder.width;

  function cleanupPriorToDelete() {
    state.leftBorderCanvas?.hide();
    state.leftBorderCanvas = undefined;

    state.rightBorderCanvas?.hide();
    state.rightBorderCanvas = undefined;

    state.topBorderCanvas?.hide();
    state.topBorderCanvas = undefined;

    state.bottomBorderCanvas?.hide();
    state.bottomBorderCanvas = undefined;
  }

  function render() {
    if (state.leftBorderCanvas) {
      addSideBorderElements(state.leftBorderCanvas, borderWidth, panelHeight);
    }

    if (state.rightBorderCanvas) {
      addSideBorderElements(state.rightBorderCanvas, borderWidth, panelHeight);
    }

    if (state.topBorderCanvas) {
      addHorizontalBorderElements(
        state.topBorderCanvas,
        panelWidth,
        borderWidth,
      );
    }

    if (state.bottomBorderCanvas) {
      addHorizontalBorderElements(
        state.bottomBorderCanvas,
        panelWidth,
        borderWidth,
      );
    }
  }

  function setPanelVisibility(visible: boolean) {
    state.panelIsVisible = visible;
    render();
  }

  const state: {
    leftBorderCanvas: hs.canvas.CanvasType | undefined;
    rightBorderCanvas: hs.canvas.CanvasType | undefined;
    topBorderCanvas: hs.canvas.CanvasType | undefined;
    bottomBorderCanvas: hs.canvas.CanvasType | undefined;
    panelIsVisible: boolean;
  } = {
    leftBorderCanvas: undefined,
    rightBorderCanvas: undefined,
    topBorderCanvas: undefined,
    bottomBorderCanvas: undefined,
    panelIsVisible: true,
  };

  //---------------------------------------------------------------------------
  // Left border
  //---------------------------------------------------------------------------
  state.leftBorderCanvas = hs.canvas.new({
    x: panelX - borderWidth,
    y: panelY,
    w: panelWidth,
    h: panelHeight,
  });

  state.leftBorderCanvas.alpha(DEFAULT_THEME.panelBorder.alpha);
  state.leftBorderCanvas.show();

  //---------------------------------------------------------------------------
  // Right border
  //---------------------------------------------------------------------------
  state.rightBorderCanvas = hs.canvas.new({
    x: panelX + panelWidth,
    y: panelY,
    w: panelWidth,
    h: panelHeight,
  });

  state.rightBorderCanvas.alpha(DEFAULT_THEME.panelBorder.alpha);
  state.rightBorderCanvas.show();

  //---------------------------------------------------------------------------
  // Top border
  //---------------------------------------------------------------------------
  state.topBorderCanvas = hs.canvas.new({
    x: panelX - borderWidth,
    y: panelY - borderWidth,
    w: panelWidth + 2 * borderWidth,
    h: borderWidth,
  });

  state.topBorderCanvas.alpha(DEFAULT_THEME.panelBorder.alpha);
  state.topBorderCanvas.show();

  //---------------------------------------------------------------------------
  // Bottom border
  //---------------------------------------------------------------------------
  state.bottomBorderCanvas = hs.canvas.new({
    x: panelX - borderWidth,
    y: panelY + panelHeight,
    w: panelWidth + 2 * borderWidth,
    h: borderWidth,
  });

  state.bottomBorderCanvas.alpha(DEFAULT_THEME.panelBorder.alpha);
  state.bottomBorderCanvas.show();

  //---------------------------------------------------------------------------
  render();

  return {
    bringToFront: () => {
      state.leftBorderCanvas?.show();
      state.rightBorderCanvas?.show();
      state.topBorderCanvas?.show();
      state.bottomBorderCanvas?.show();
    },
    cleanupPriorToDelete,
    setPanelVisibility,
  };
}

function addSideBorderElements(
  canvas: hs.canvas.CanvasType,
  panelBorderWidth: number,
  panelBorderHeight: number,
) {
  canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: DEFAULT_THEME.panelBorder.color,
      strokeColor: DEFAULT_THEME.panelBorder.color,
      frame: {
        x: 0,
        y: 0,
        w: panelBorderWidth,
        h: panelBorderHeight,
      },
    },
  ]);
}

function addHorizontalBorderElements(
  canvas: hs.canvas.CanvasType,
  panelWidth: number,
  panelBorderHeight: number,
) {
  canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: DEFAULT_THEME.panelBorder.color,
      strokeColor: DEFAULT_THEME.panelBorder.color,
      frame: {
        x: 0,
        y: 0,
        w: panelWidth + 2 * panelBorderHeight,
        h: panelBorderHeight,
      },
    },
  ]);
}
