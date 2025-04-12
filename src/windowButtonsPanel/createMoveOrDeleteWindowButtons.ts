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

import { buildWindowButton } from './windowButton';
import { processNewWindowIdsList } from './processNewWindowIdsList';
import type { WindowButtonsInfoById } from './types';

const BUTTON_PADDING = 5;

export function createMoveOrDeleteWindowButtons(args: {
  panelGeometry: {
    x: number;
    y: number;
    width: number;
  };
  isPanelVisible: boolean;
  showWindowPreviewOnHover: boolean;
  previousWindowButtonsInfoById: WindowButtonsInfoById;
  newWindowsList: hs.window.WindowType[];
}): WindowButtonsInfoById {
  const {
    showWindowPreviewOnHover,
    panelGeometry,
    previousWindowButtonsInfoById,
    isPanelVisible,
    newWindowsList,
  } = args;

  const {
    orderedPreExistingWindowIds,
    newWindowIds,
    noLongerExistingWindowIds,
  } = processNewWindowIdsList({
    orderedPreviousWindowIds: Array.from(previousWindowButtonsInfoById.keys()),
    newWindowIdsList: newWindowsList.map((w) => w.id()),
  });

  const buttonWidth = getButtonWidth(
    panelGeometry.width,
    newWindowsList.length,
  );

  const newWindowButtonsInfoById: WindowButtonsInfoById = new Map();

  // Some pre-existing windows may have been removed, thereby changing
  // position and size of remaining window buttons, so recalculate and tell
  // them to update
  let windowButtonX = panelGeometry.x + BUTTON_PADDING;
  orderedPreExistingWindowIds.forEach((windowId) => {
    const windowButtonInfo = previousWindowButtonsInfoById.get(windowId);
    if (windowButtonInfo) {
      windowButtonInfo.actions.setCurrentButtonGeometry({
        x: windowButtonX,
        y: panelGeometry.y + 5,
        width: buttonWidth,
        height: 35,
      });
      windowButtonX += buttonWidth + BUTTON_PADDING;

      newWindowButtonsInfoById.set(windowId, windowButtonInfo);
    }
  });

  // Create window button objects for all the new windows
  newWindowIds.forEach((windowId) => {
    const windowObject = newWindowsList.find(
      (wObject) => wObject.id() === windowId,
    );

    if (windowObject) {
      const newWindowButtonInfo = {
        w: windowObject,
        actions: buildWindowButton({
          buttonGeometry: {
            x: windowButtonX,
            y: panelGeometry.y + 5,
            width: buttonWidth,
            height: 35,
          },
          windowState: {
            title: windowObject.title(),
            isMinimized: windowObject.isMinimized(),
          },
          windowObject,
          isInitiallyVisible: isPanelVisible,
          showWindowPreviewOnHover: showWindowPreviewOnHover,
        }),
      };

      newWindowButtonsInfoById.set(windowId, newWindowButtonInfo);
      windowButtonX += buttonWidth + BUTTON_PADDING;
    }
  });

  // Tell windowButtons corresponding to deleted windows to delete themselves
  noLongerExistingWindowIds.forEach((windowId) => {
    const windowInfo = previousWindowButtonsInfoById.get(windowId);
    if (windowInfo) {
      windowInfo.actions.cleanupPriorToDelete();
    }
  });

  return newWindowButtonsInfoById;
}

function getButtonWidth(totalWidth: number, numButtons: number) {
  const MAX_BUTTON_WIDTH = 120;

  // Layout looks like this:
  //    [leftEdge] [padding] [button] [padding] [button] [padding] [rightEdge]
  const buttonWidth =
    (totalWidth - (numButtons + 1) * BUTTON_PADDING) / numButtons;

  return Math.min(buttonWidth, MAX_BUTTON_WIDTH);
}
