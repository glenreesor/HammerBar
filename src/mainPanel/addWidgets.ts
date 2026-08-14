// Copyright 2025, 2026 Glen Reesor
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

import type { WidgetHandle, WidgetBuildingInfoSuccess } from './types';
import { TOGGLE_BUTTON_WIDTH } from './constants';

export function addWidgets(args: {
  coords: { x: number; y: number };
  dimensions: { w: number; h: number };
  widgetsBuildingInfo: {
    left: WidgetBuildingInfoSuccess[];
    right: WidgetBuildingInfoSuccess[];
  };
  panelColor: hs.canvas.Color;
  panelHoverColor: hs.canvas.Color;
}): {
  widgetHandles: WidgetHandle[];
  endOfLeftWidgets: number;
} {
  const widgetHandles: WidgetHandle[] = [];

  // Left Widgets
  let widgetLeftX = args.coords.x + TOGGLE_BUTTON_WIDTH;
  args.widgetsBuildingInfo.left.forEach((builderInfo) => {
    const newWidget = builderInfo.buildWidget({
      coords: { leftX: widgetLeftX, rightX: undefined, y: args.coords.y },
      widgetHeight: args.dimensions.h,
      panelColor: args.panelColor,
      panelHoverColor: args.panelHoverColor,
    });

    widgetHandles.push(newWidget);
    widgetLeftX += newWidget.width;
  });

  const endOfLeftWidgets = widgetLeftX;

  // Right Widgets
  let widgetRightX = args.coords.x + args.dimensions.w - TOGGLE_BUTTON_WIDTH;

  args.widgetsBuildingInfo.right.forEach((builderInfo) => {
    const newWidget = builderInfo.buildWidget({
      coords: { leftX: undefined, rightX: widgetRightX, y: args.coords.y },
      widgetHeight: args.dimensions.h,
      panelColor: args.panelColor,
      panelHoverColor: args.panelHoverColor,
    });

    widgetHandles.push(newWidget);
    widgetRightX -= newWidget.width;
  });

  return {
    widgetHandles,
    endOfLeftWidgets,
  };
}
