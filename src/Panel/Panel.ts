// Copyright 2024 Glen Reesor
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
import { TOGGLE_BUTTON_WIDTH } from './constants';
import type {
  WidgetBuilder,
  WidgetBuilderReturnType,
  WidgetBuildingInfo,
} from './types';

export default function Panel(panelArgs: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
  widgetsBuildingInfo: {
    left: WidgetBuildingInfo[];
    right: WidgetBuildingInfo[];
  };
  windowListBuilder: (args: {
    coords: { x: number; y: number };
    dimensions: { height: number; width: number };
  }) => WidgetBuilderReturnType;
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
    canvas: hs.CanvasType | undefined;
    isVisible: boolean;
  } = {
    canvas: undefined,
    isVisible: true,
  };

  const panelColor = { red: 100 / 255, green: 100 / 255, blue: 100 / 255 };
  const panelHoverColor = { red: 120 / 255, green: 120 / 255, blue: 120 / 255 };

  state.canvas = hs.canvas.new({
    x: panelArgs.coords.x,
    y: panelArgs.coords.y,
    w: panelArgs.dimensions.w,
    h: panelArgs.dimensions.h,
  });
  state.canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: panelColor,
      strokeColor: panelColor,
      frame: {
        x: 0,
        y: 0,
        w: panelArgs.dimensions.w,
        h: panelArgs.dimensions.h,
      },
    },
  ]);
  state.canvas.show();

  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];

  // Left Toggle Button
  toggleButtons.push(
    ToggleButton({
      panelX: panelArgs.coords.x,
      panelY: panelArgs.coords.y,
      panelWidth: panelArgs.dimensions.w,
      panelHeight: panelArgs.dimensions.h,
      side: 'left',
      panelColor,
      panelHoverColor,
      onClick: toggleVisibility,
    }),
  );

  // Right Toggle Button
  toggleButtons.push(
    ToggleButton({
      panelX: panelArgs.coords.x,
      panelY: panelArgs.coords.y,
      panelWidth: panelArgs.dimensions.w,
      panelHeight: panelArgs.dimensions.h,
      side: 'right',
      panelColor,
      panelHoverColor,
      onClick: toggleVisibility,
    }),
  );

  const widgets: ReturnType<WidgetBuilder>[] = [];

  // Left Widgets
  let widgetX = panelArgs.coords.x + TOGGLE_BUTTON_WIDTH;
  panelArgs.widgetsBuildingInfo.left.forEach((builderInfo) => {
    widgets.push(
      builderInfo.getWidget({
        coords: { x: widgetX, y: panelArgs.coords.y },
        height: panelArgs.dimensions.h,
        panelColor,
        panelHoverColor,
      }),
    );
    widgetX += builderInfo.getWidth(panelArgs.dimensions.h);
  });

  const endOfLeftWidgets = widgetX;

  // Right Widgets
  widgetX = panelArgs.coords.x + panelArgs.dimensions.w - TOGGLE_BUTTON_WIDTH;
  panelArgs.widgetsBuildingInfo.right.forEach((builderInfo) => {
    widgetX -= builderInfo.getWidth(panelArgs.dimensions.h);
    widgets.push(
      builderInfo.getWidget({
        coords: { x: widgetX, y: panelArgs.coords.y },
        height: panelArgs.dimensions.h,
        panelColor,
        panelHoverColor,
      }),
    );
  });

  const totalWidgetWidth =
    2 * TOGGLE_BUTTON_WIDTH +
    panelArgs.widgetsBuildingInfo.right.reduce(
      (acc, info) => acc + info.getWidth(panelArgs.dimensions.h),
      0,
    ) +
    panelArgs.widgetsBuildingInfo.left.reduce(
      (acc, info) => acc + info.getWidth(panelArgs.dimensions.h),
      0,
    );

  widgets.push(
    panelArgs.windowListBuilder({
      coords: {
        x: endOfLeftWidgets,
        y: panelArgs.coords.y,
      },
      dimensions: {
        height: panelArgs.dimensions.h,
        width: panelArgs.dimensions.w - totalWidgetWidth,
      },
    }),
  );

  return {
    cleanupPriorToDelete,
  };
}
