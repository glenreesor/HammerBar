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

export default function ToggleButton(
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
  function render(panelIsVisible: boolean) {
    const fontSize = 14;
    let toggleSymbol;

    if (side === 'left') {
      toggleSymbol = panelIsVisible ? '<' : '>';
    } else {
      toggleSymbol = panelIsVisible ? '>' : '<';
    }

    canvas.replaceElements([
      {
        type: 'rectangle',
        fillColor: { red: 40/255, green: 40/255, blue: 100/255 },
        strokeColor: { red: 40/255, green: 40/255, blue: 100/255 },
        frame: {
          x: 0,
          y: 0,
          w: 20,
          h: panelHeight,
        },
        trackMouseUp: true,
      },
      {
        type: 'text',
        text: toggleSymbol,
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: buttonWidth / 4,
          y: panelHeight / 2 - fontSize / 1.5,
          w: fontSize,
          h: fontSize * 1.2,
        },
        trackMouseUp: true,
      },
    ]);
  }

  const buttonWidth = 20;
  const x = side === 'left' ? panelX : panelX + panelWidth - buttonWidth;
  const canvas = hs.canvas.new({ x, y: panelY, w: buttonWidth, h: panelHeight });
  render(true);
  canvas.mouseCallback(onClick);
  canvas.show();

  return {
    setPanelVisibility: (visible: boolean) => render(visible),
    showCanvas: () => canvas.show(),
  };
}
