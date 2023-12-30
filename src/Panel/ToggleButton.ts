// Copyright 2023 Glen Reesor
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

export default class ToggleButton {
  _buttonWidth = 20;

  _buttonHeight: number;
  _canvas: hs.CanvasType;
  _panelSide: 'left' | 'right';

  constructor(
    { panelX, panelY, panelWidth, panelHeight, side, onClick }:
    {
      panelX: number;
      panelY: number;
      panelWidth: number;
      panelHeight: number;
      side: 'left' | 'right';
      onClick: () => void;
    }
  ) {
    const x = side === 'left' ? panelX : panelX + panelWidth - this._buttonWidth;

    this._buttonHeight = panelHeight;
    this._panelSide = side;

    this._canvas = hs.canvas.new({ x, y: panelY, w: this._buttonWidth, h: panelHeight });
    this._render(true);
    this._canvas.mouseCallback(onClick);
    this._canvas.show();
  }

  setPanelVisibility(visible: boolean) {
    this._render(visible);
  }

  /**
   * Tell the underlying canvas to show itself, which results in Hammerspoon
   * drawing it on top of any other canvases
   */
  showCanvas() {
    this._canvas.show();
  }

  _render(panelIsVisible: boolean) {
    const fontSize = 14;
    let toggleSymbol;

    if (this._panelSide === 'left') {
      toggleSymbol = panelIsVisible ? '<' : '>';
    } else {
      toggleSymbol = panelIsVisible ? '>' : '<';
    }

    this._canvas.replaceElements([
      {
        type: 'rectangle',
        fillColor: { red: 40/255, green: 40/255, blue: 100/255 },
        strokeColor: { red: 40/255, green: 40/255, blue: 100/255 },
        frame: {
          x: 0,
          y: 0,
          w: 20,
          h: this._buttonHeight,
        },
        trackMouseUp: true,
      },
      {
        type: 'text',
        text: toggleSymbol,
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: this._buttonWidth / 4,
          y: this._buttonHeight / 2 - fontSize / 1.5,
          w: fontSize,
          h: fontSize * 1.2,
        },
        trackMouseUp: true,
      },
    ]);
  }
}
