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

import ToggleButton from './toggleButton';
import { TOGGLE_BUTTON_WIDTH } from './constants';
import type {
  WidgetBuilder,
  WidgetBuilderReturnType,
  WidgetBuildingInfo,
} from './types';
import { DEFAULT_THEME } from 'src/theme';

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
  function cleanupPriorToDelete() {
    toggleButtons.forEach((button) => button.cleanupPriorToDelete());
    widgets.forEach((widget) => widget.cleanupPriorToDelete());
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

  const panelColor = DEFAULT_THEME.panel.normal.background;
  const panelHoverColor = DEFAULT_THEME.panel.hover.background;

  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];

  // Left Toggle Button
  toggleButtons.push(
    ToggleButton({
      panelX: params.coords.x,
      panelY: params.coords.y,
      panelWidth: params.dimensions.w,
      panelHeight: params.dimensions.h,
      side: 'left',
      panelColor,
      panelHoverColor,
      onClick: toggleVisibility,
    }),
  );

  // Right Toggle Button
  toggleButtons.push(
    ToggleButton({
      panelX: params.coords.x,
      panelY: params.coords.y,
      panelWidth: params.dimensions.w,
      panelHeight: params.dimensions.h,
      side: 'right',
      panelColor,
      panelHoverColor,
      onClick: toggleVisibility,
    }),
  );

  const widgets: ReturnType<WidgetBuilder>[] = [];

  // Left Widgets
  let widgetX = params.coords.x + TOGGLE_BUTTON_WIDTH;
  params.widgetsBuildingInfo.left.forEach((builderInfo) => {
    widgets.push(
      builderInfo.getWidget({
        coords: { x: widgetX, y: params.coords.y },
        height: params.dimensions.h,
        panelColor,
        panelHoverColor,
      }),
    );
    widgetX += builderInfo.getWidth(params.dimensions.h);
  });

  const endOfLeftWidgets = widgetX;

  // Right Widgets
  widgetX = params.coords.x + params.dimensions.w - TOGGLE_BUTTON_WIDTH;
  params.widgetsBuildingInfo.right.forEach((builderInfo) => {
    widgetX -= builderInfo.getWidth(params.dimensions.h);
    widgets.push(
      builderInfo.getWidget({
        coords: { x: widgetX, y: params.coords.y },
        height: params.dimensions.h,
        panelColor,
        panelHoverColor,
      }),
    );
  });

  const totalWidgetWidth =
    2 * TOGGLE_BUTTON_WIDTH +
    params.widgetsBuildingInfo.right.reduce(
      (acc, info) => acc + info.getWidth(params.dimensions.h),
      0,
    ) +
    params.widgetsBuildingInfo.left.reduce(
      (acc, info) => acc + info.getWidth(params.dimensions.h),
      0,
    );

  widgets.push(
    params.windowListBuilder({
      coords: {
        x: endOfLeftWidgets,
        y: params.coords.y,
      },
      dimensions: {
        height: params.dimensions.h,
        width: params.dimensions.w - totalWidgetWidth,
      },
    }),
  );

  return {
    cleanupPriorToDelete,
  };
}
