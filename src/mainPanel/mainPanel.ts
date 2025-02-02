// Copyright 2023-2025 Glen Reesor
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
import type { Widget, WidgetBuildingInfo } from './types';

export function mainPanel(params: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
  widgetsBuildingInfo: {
    left: WidgetBuildingInfo[];
    right: WidgetBuildingInfo[];
  };
  windowListBuilder: (panelParams: {
    coords: { x: number; y: number };
    dimensions: { height: number; width: number };
  }) => Widget;
}) {
  function cleanupPriorToDelete() {
    state.canvas?.hide();
    state.canvas = undefined;
    toggleButtons.forEach((button) => button.cleanupPriorToDelete());
    widgets.forEach((widget) => widget.cleanupPriorToDelete());
  }

  function toggleVisibility() {
    if (!state.canvas) {
      return;
    }

    state.isVisible = !state.isVisible;
    if (state.isVisible) {
      state.canvas.show();
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(true);
        button.bringToFront();
      });
      widgets.forEach((widget) => {
        widget.show();
        widget.bringToFront();
      });
    } else {
      state.canvas.hide();
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
    canvas: hs.canvas.CanvasType | undefined;
    isVisible: boolean;
  } = {
    canvas: undefined,
    isVisible: true,
  };

  const panelColor = { red: 100 / 255, green: 100 / 255, blue: 100 / 255 };
  const panelHoverColor = { red: 120 / 255, green: 120 / 255, blue: 120 / 255 };

  state.canvas = hs.canvas.new({
    x: params.coords.x,
    y: params.coords.y,
    w: params.dimensions.w,
    h: params.dimensions.h,
  });
  state.canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: panelColor,
      strokeColor: panelColor,
      frame: {
        x: 0,
        y: 0,
        w: params.dimensions.w,
        h: params.dimensions.h,
      },
    },
  ]);
  state.canvas.show();

  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];

  // Left Toggle Button
  toggleButtons.push(
    ToggleButton({
      coords: {
        x: params.coords.x,
        y: params.coords.y,
      },
      panelHeight: params.dimensions.h,
      panelColor,
      panelHoverColor,
      side: 'left',
      onClick: toggleVisibility,
    }),
  );

  // Right Toggle Button
  toggleButtons.push(
    ToggleButton({
      coords: {
        x: params.coords.x + params.dimensions.w - TOGGLE_BUTTON_WIDTH,
        y: params.coords.y,
      },
      panelHeight: params.dimensions.h,
      panelColor,
      panelHoverColor,
      side: 'right',
      onClick: toggleVisibility,
    }),
  );

  const widgets: Widget[] = [];

  // Left Widgets
  let widgetLeftX = params.coords.x + TOGGLE_BUTTON_WIDTH;
  params.widgetsBuildingInfo.left.forEach((builderInfo) => {
    const newWidget = builderInfo.buildWidget({
      coords: { leftX: widgetLeftX, rightX: undefined, y: params.coords.y },
      widgetHeight: params.dimensions.h,
      panelColor,
      panelHoverColor,
    });

    widgets.push(newWidget);
    widgetLeftX += newWidget.width;
  });

  const endOfLeftWidgets = widgetLeftX;

  // Right Widgets
  let widgetRightX =
    params.coords.x + params.dimensions.w - TOGGLE_BUTTON_WIDTH;

  params.widgetsBuildingInfo.right.forEach((builderInfo) => {
    const newWidget = builderInfo.buildWidget({
      coords: { leftX: undefined, rightX: widgetRightX, y: params.coords.y },
      widgetHeight: params.dimensions.h,
      panelColor,
      panelHoverColor,
    });

    widgets.push(newWidget);
    widgetRightX -= newWidget.width;
  });

  const totalWidgetWidth =
    2 * TOGGLE_BUTTON_WIDTH +
    widgets.reduce((acc, widget) => acc + widget.width, 0);

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
