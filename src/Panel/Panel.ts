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

import ToggleButton from './ToggleButton';

export default function Panel (
  { x, y, width, height, color }:
  { x: number, y: number, width: number, height: number, color: hs.ColorType }
): {
  destroy: () => void,
} {
  function toggleVisibility() {
    state.isVisible = !state.isVisible;
    if (state.isVisible) {
      canvas.show();
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(true);
        button.bringToFront();
      });
    } else {
      canvas.hide();
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(false);
        button.bringToFront();
      });
    }
  };

  const canvas = hs.canvas.new({ x, y, w: width, h: height });
  canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: color,
      strokeColor: color,
      frame: {
        x: 0,
        y: 0,
        w: width,
        h: height,
      },
    },
  ]);
  canvas.show();

  const state = {
    isVisible: true,
  };

  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];

  // Left Toggle Button
  toggleButtons.push(ToggleButton({
    panelX: x,
    panelY: y,
    panelWidth: width,
    panelHeight: height,
    side: 'left',
    onClick: toggleVisibility
  }));

  // Right Toggle Button
  toggleButtons.push(ToggleButton({
    panelX: x,
    panelY: y,
    panelWidth: width,
    panelHeight: height,
    side: 'right',
    onClick: toggleVisibility
  }));

  return {
    destroy: canvas.delete,
  };
}
