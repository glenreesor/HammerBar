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

import { addBorders } from './addBorders';
import { addToggleButtons } from './addToggleButtons';
import { addWidgets } from './addWidgets';
import { TOGGLE_BUTTON_WIDTH } from './constants';
import type { WidgetHandle, WidgetBuildingInfoSuccess } from './types';
import { getTheme } from 'src/theme';

export function mainPanel(params: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
  widgetsBuildingInfo: {
    left: WidgetBuildingInfoSuccess[];
    right: WidgetBuildingInfoSuccess[];
  };
  windowButtonsPanelBuilder: (panelParams: {
    x: number;
    y: number;
    height: number;
    width: number;
  }) => WidgetHandle;
}) {
  function prepareForRemoval() {
    borders.prepareForRemoval();
    toggleButtons.forEach((button) => button.prepareForRemoval());
    widgetHandles.forEach((widget) => widget.prepareForRemoval());
  }

  function toggleVisibility() {
    state.isVisible = !state.isVisible;
    borders.setPanelVisibility(state.isVisible);

    if (state.isVisible) {
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(true);
        button.bringToFront();
      });
      widgetHandles.forEach((widget) => {
        widget.show();
        widget.bringToFront();
      });
    } else {
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(false);
        button.bringToFront();
      });
      widgetHandles.forEach((widget) => {
        widget.hide();
      });
    }
  }

  const panelBorderWidth = getTheme().panelBorder.width;
  const innerPanelCoords = {
    x: params.coords.x + panelBorderWidth,
    y: params.coords.y + panelBorderWidth,
  };

  const innerPanelDimensions = {
    w: params.dimensions.w - 2 * panelBorderWidth,
    h: params.dimensions.h - 2 * panelBorderWidth,
  };

  const state: {
    isVisible: boolean;
  } = {
    isVisible: true,
  };

  const toggleButtons = addToggleButtons({
    coords: innerPanelCoords,
    dimensions: innerPanelDimensions,
    toggleVisibility,
  });

  const borders = addBorders(params);

  const { widgetHandles, endOfLeftWidgets } = addWidgets({
    coords: innerPanelCoords,
    dimensions: innerPanelDimensions,
    widgetsBuildingInfo: params.widgetsBuildingInfo,
  });

  const totalWidgetWidth =
    2 * TOGGLE_BUTTON_WIDTH +
    widgetHandles.reduce((acc, widget) => acc + widget.width, 0);

  widgetHandles.push(
    params.windowButtonsPanelBuilder({
      x: endOfLeftWidgets,
      y: innerPanelCoords.y,
      height: innerPanelDimensions.h,
      width: innerPanelDimensions.w - totalWidgetWidth,
    }),
  );

  return {
    prepareForRemoval,
  };
}
