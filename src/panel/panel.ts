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

import { DEFAULT_THEME } from '../theme';
import ToggleButton from './toggleButton';
import PanelBorders from './panelBorders';
import { TOGGLE_BUTTON_WIDTH } from './constants';
import type {
  WidgetBuilder,
  WidgetBuilderReturnType,
  WidgetBuildingInfo,
} from './types';

export default function panel(params: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
  widgetsBuildingInfo: {
    left: WidgetBuildingInfo[];
    right: WidgetBuildingInfo[];
  };
  windowListBuilder: (panelParams: {
    coords: { x: number; y: number };
    dimensions: { height: number; width: number };
  }) => WidgetBuilderReturnType;
}) {
  const panelBorderWidth = DEFAULT_THEME.panelBorder.width;

  const panelCoords = {
    x: params.coords.x + panelBorderWidth,
    y: params.coords.y - panelBorderWidth,
  };

  const panelDimensions = {
    w: params.dimensions.w - 2 * panelBorderWidth,
    h: params.dimensions.h,
  };

  function cleanupPriorToDelete() {
    toggleButtons.forEach((button) => button.cleanupPriorToDelete());
    widgets.forEach((widget) => widget.cleanupPriorToDelete());
    panelBorders.cleanupPriorToDelete();
  }

  function toggleVisibility() {
    state.isVisible = !state.isVisible;
    if (state.isVisible) {
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(true);
        button.bringToFront();
      });
      widgets.forEach((widget) => {
        widget.show();
        widget.bringToFront();
      });
    } else {
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(false);
        button.bringToFront();
      });
      widgets.forEach((widget) => {
        widget.hide();
      });
    }
  }

  const state: {
    isVisible: boolean;
  } = {
    isVisible: true,
  };

  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];
  const panelBorders = PanelBorders({
    panelX: panelCoords.x,
    panelY: panelCoords.y,
    panelWidth: panelDimensions.w,
    panelHeight: panelDimensions.h,
  });

  // Left Toggle Button
  toggleButtons.push(
    ToggleButton({
      panelX: panelCoords.x,
      panelY: panelCoords.y,
      panelWidth: panelDimensions.w,
      panelHeight: panelDimensions.h,
      side: 'left',
      onClick: toggleVisibility,
    }),
  );

  // Right Toggle Button
  toggleButtons.push(
    ToggleButton({
      panelX: panelCoords.x,
      panelY: panelCoords.y,
      panelWidth: panelDimensions.w,
      panelHeight: panelDimensions.h,
      side: 'right',
      onClick: toggleVisibility,
    }),
  );

  const widgets: ReturnType<WidgetBuilder>[] = [];

  // Left Widgets
  let widgetX = panelCoords.x + TOGGLE_BUTTON_WIDTH;
  params.widgetsBuildingInfo.left.forEach((builderInfo) => {
    widgets.push(
      builderInfo.getWidget({
        coords: { x: widgetX, y: panelCoords.y },
        height: panelDimensions.h,
      }),
    );
    widgetX += builderInfo.getWidth(panelDimensions.h);
  });

  const endOfLeftWidgets = widgetX;

  // Right Widgets
  widgetX = panelCoords.x + panelDimensions.w - TOGGLE_BUTTON_WIDTH;
  params.widgetsBuildingInfo.right.forEach((builderInfo) => {
    widgetX -= builderInfo.getWidth(panelDimensions.h);
    widgets.push(
      builderInfo.getWidget({
        coords: { x: widgetX, y: panelCoords.y },
        height: panelDimensions.h,
      }),
    );
  });

  const totalWidgetWidth =
    2 * TOGGLE_BUTTON_WIDTH +
    params.widgetsBuildingInfo.right.reduce(
      (acc, info) => acc + info.getWidth(panelDimensions.h),
      0,
    ) +
    params.widgetsBuildingInfo.left.reduce(
      (acc, info) => acc + info.getWidth(panelDimensions.h),
      0,
    );

  widgets.push(
    params.windowListBuilder({
      coords: {
        x: endOfLeftWidgets,
        y: panelCoords.y,
      },
      dimensions: {
        height: panelDimensions.h,
        width: panelDimensions.w - totalWidgetWidth,
      },
    }),
  );

  return {
    cleanupPriorToDelete,
  };
}
