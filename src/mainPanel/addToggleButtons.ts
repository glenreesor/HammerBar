// Copyright 2023-2026 Glen Reesor
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

import { TOGGLE_BUTTON_WIDTH } from './constants';
import ToggleButton from './toggleButton';

export function addToggleButtons(args: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
  toggleVisibility: () => void;
}): ReturnType<typeof ToggleButton>[] {
  const { coords, dimensions, toggleVisibility } = args;
  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];

  // Left Toggle Button
  toggleButtons.push(
    ToggleButton({
      coords: coords,
      panelHeight: dimensions.h,
      side: 'left',
      onClick: toggleVisibility,
    }),
  );

  // Right Toggle Button
  toggleButtons.push(
    ToggleButton({
      coords: {
        x: coords.x + dimensions.w - TOGGLE_BUTTON_WIDTH,
        y: coords.y,
      },
      panelHeight: dimensions.h,
      side: 'right',
      onClick: toggleVisibility,
    }),
  );

  return toggleButtons;
}
