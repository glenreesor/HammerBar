// Copyright 2023-2025 Glen Reesor
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
import { TOGGLE_BUTTON_WIDTH } from './constants';

export default function ToggleButton(args: {
  coords: { x: number; y: number };
  panelHeight: number;
  panelColor: hs.canvas.Color;
  panelHoverColor: hs.canvas.Color;
  side: 'left' | 'right';
  onClick: () => void;
}) {
  const { coords, panelHeight, panelColor, panelHoverColor, side, onClick } =
    args;

  function cleanupPriorToDelete() {
    state.canvas?.hide();
    state.canvas = undefined;
  }

  const mouseCallback: hs.canvas.CanvasMouseCallback = function (
    this: void,
    _canvas: hs.canvas.Canvas,
    msg: 'mouseEnter' | 'mouseExit' | 'mouseUp',
  ) {
    if (msg === 'mouseEnter') {
      state.mouseIsInsideButton = true;
      render();
    } else if (msg === 'mouseExit') {
      state.mouseIsInsideButton = false;
      render();
    } else if (msg === 'mouseUp') {
      onClick();
    }
  };

  function render() {
    const bgColor = state.mouseIsInsideButton ? panelHoverColor : panelColor;

    const fontSize = 14;
    let toggleSymbol;

    if (side === 'left') {
      toggleSymbol = state.panelIsVisible ? '<' : '>';
    } else {
      toggleSymbol = state.panelIsVisible ? '>' : '<';
    }

    state.canvas?.replaceElements([
      {
        type: 'rectangle',
        fillColor: bgColor,
        strokeColor: bgColor,
        frame: {
          x: 0,
          y: 0,
          w: TOGGLE_BUTTON_WIDTH,
          h: panelHeight,
        },
        trackMouseEnterExit: true,
        trackMouseUp: true,
      },
      {
        type: 'text',
        text: toggleSymbol,
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: TOGGLE_BUTTON_WIDTH / 4,
          y: panelHeight / 2 - fontSize / 1.5,
          w: fontSize,
          h: fontSize * 1.2,
        },
        trackMouseEnterExit: true,
        trackMouseUp: true,
      },
    ]);
  }

  function setPanelVisibility(visible: boolean) {
    state.panelIsVisible = visible;
    render();
  }

  const state: {
    canvas: hs.canvas.Canvas | undefined;
    mouseIsInsideButton: boolean;
    panelIsVisible: boolean;
  } = {
    canvas: undefined,
    mouseIsInsideButton: false,
    panelIsVisible: true,
  };

  state.canvas = hs.canvas.new({
    x: coords.x,
    y: coords.y,
    w: TOGGLE_BUTTON_WIDTH,
    h: panelHeight,
  });
  render();
  state.canvas.mouseCallback(mouseCallback);
  state.canvas.show();

  return {
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    setPanelVisibility,
  };
}
