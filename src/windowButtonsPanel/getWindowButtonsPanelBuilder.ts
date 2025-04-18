// Copyright 2024, 2025 Glen Reesor
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

import { buildWindowButtonsPanel } from './buildWindowButtonsPanel';
import type { WindowState } from 'src/windowListAndStateWatcher';

export function getWindowButtonsPanelBuilder(args: {
  screenId: number;
  showWindowPreviewOnHover: boolean;
  subscribeToWindowListUpdates: (
    screenId: number,
    callback: (windowStates: WindowState[]) => void,
  ) => () => void;
}) {
  const { screenId, showWindowPreviewOnHover, subscribeToWindowListUpdates } =
    args;

  return (geometry: { x: number; y: number; height: number; width: number }) =>
    buildWindowButtonsPanel({
      screenId,
      showWindowPreviewOnHover,
      geometry,
      subscribeToWindowListUpdates,
    });
}
