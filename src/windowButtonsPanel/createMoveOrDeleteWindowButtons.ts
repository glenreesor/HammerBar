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

import type { WindowState } from 'src/windowListAndStateWatcher';
import { buildWindowButton } from './windowButton';
import { processNewWindowIdsList } from './processNewWindowIdsList';
import type { WindowButtonActionsById } from './types';

const BUTTON_PADDING = 5;

export function createMoveOrDeleteWindowButtons(args: {
  panelGeometry: {
    x: number;
    y: number;
    width: number;
  };
  isPanelVisible: boolean;
  previousWindowButtonActionsById: WindowButtonActionsById;
  newWindowStates: WindowState[];
}): WindowButtonActionsById {
  const {
    panelGeometry,
    previousWindowButtonActionsById,
    isPanelVisible,
    newWindowStates,
  } = args;

  const {
    orderedPreExistingWindowIds,
    newWindowIds,
    noLongerExistingWindowIds,
  } = processNewWindowIdsList({
    orderedPreviousWindowIds: Array.from(
      previousWindowButtonActionsById.keys(),
    ),
    newWindowIdsList: newWindowStates.map((w) => w.id),
  });

  const buttonWidth = getButtonWidth(
    panelGeometry.width,
    newWindowStates.length,
  );

  const newWindowButtonActionsById: WindowButtonActionsById = new Map();

  // Some pre-existing windows may have been removed, thereby changing
  // position and size of remaining window buttons, so recalculate and tell
  // them to update
  let windowButtonX = panelGeometry.x + BUTTON_PADDING;
  orderedPreExistingWindowIds.forEach((windowId) => {
    const windowButtonActions = previousWindowButtonActionsById.get(windowId);
    if (windowButtonActions) {
      windowButtonActions.setCurrentButtonGeometry({
        x: windowButtonX,
        y: panelGeometry.y + 5,
        width: buttonWidth,
        height: 35,
      });
      windowButtonX += buttonWidth + BUTTON_PADDING;

      newWindowButtonActionsById.set(windowId, windowButtonActions);
    }
  });

  // Create window button objects for all the new windows
  newWindowIds.forEach((windowId) => {
    const windowState = newWindowStates.find((thing) => thing.id === windowId);

    if (windowState) {
      const newWindowButtonActions = buildWindowButton({
        buttonGeometry: {
          x: windowButtonX,
          y: panelGeometry.y + 5,
          width: buttonWidth,
          height: 35,
        },
        windowState,
        isInitiallyVisible: isPanelVisible,
      });

      newWindowButtonActionsById.set(windowId, newWindowButtonActions);
      windowButtonX += buttonWidth + BUTTON_PADDING;
    }
  });

  // Tell windowButtons corresponding to deleted windows to delete themselves
  noLongerExistingWindowIds.forEach((windowId) => {
    const windowActions = previousWindowButtonActionsById.get(windowId);
    if (windowActions) {
      windowActions.cleanupPriorToDelete();
    }
  });

  return newWindowButtonActionsById;
}

function getButtonWidth(totalWidth: number, numButtons: number) {
  const MAX_BUTTON_WIDTH = 120;

  // Layout looks like this:
  //    [leftEdge] [padding] [button] [padding] [button] [padding] [rightEdge]
  const buttonWidth =
    (totalWidth - (numButtons + 1) * BUTTON_PADDING) / numButtons;

  return Math.min(buttonWidth, MAX_BUTTON_WIDTH);
}
