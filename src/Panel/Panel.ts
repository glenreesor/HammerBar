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
import type { WidgetBuilder, WidgetBuildingInfo } from './types';

export default function Panel (
  { x, y, width, height, widgetsBuildingInfo, windowListBuilder }:
  {
    x: number,
    y: number,
    width: number,
    height: number,
    widgetsBuildingInfo: {
      left: WidgetBuildingInfo[],
      right: WidgetBuildingInfo[],
    },
    windowListBuilder: (
      {x, y, height, width}:
      { x: number, y: number, height: number, width: number }
    ) =>  {
      bringToFront: () => void,
      cleanupPriorToDelete: () => void,
      hide: () => void,
      show: () => void,
    },
  }
) {
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
  };

  const state: {
    canvas: hs.CanvasType | undefined;
    isVisible: boolean;
  } = {
    canvas: undefined,
    isVisible: true,
  };

  const panelColor = { red: 100/255, green: 100/255, blue: 100/255 };
  const panelHoverColor = { red: 120/255, green: 120/255, blue: 120/255 };

  state.canvas = hs.canvas.new({ x, y, w: width, h: height });
  state.canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: panelColor,
      strokeColor: panelColor,
      frame: {
        x: 0,
        y: 0,
        w: width,
        h: height,
      },
    },
  ]);
  state.canvas.show();

  const toggleButtons: ReturnType<typeof ToggleButton>[] = [];

  // Left Toggle Button
  toggleButtons.push(ToggleButton({
    panelX: x,
    panelY: y,
    panelWidth: width,
    panelHeight: height,
    side: 'left',
    panelColor,
    panelHoverColor,
    onClick: toggleVisibility
  }));

  // Right Toggle Button
  toggleButtons.push(ToggleButton({
    panelX: x,
    panelY: y,
    panelWidth: width,
    panelHeight: height,
    side: 'right',
    panelColor,
    panelHoverColor,
    onClick: toggleVisibility
  }));

  const widgets: ReturnType<WidgetBuilder>[] = [];

  // Left Widgets
  let widgetX = x + TOGGLE_BUTTON_WIDTH;
  widgetsBuildingInfo.left.forEach((builderInfo) => {
    widgets.push(builderInfo.getWidget({
      x: widgetX,
      y,
      height,
      panelColor,
      panelHoverColor,
    }));
    widgetX += builderInfo.getWidth(height);
  });

  const endOfLeftWidgets = widgetX;

  // Right Widgets
  widgetX = x + width - TOGGLE_BUTTON_WIDTH;
  widgetsBuildingInfo.right.forEach((builderInfo) => {
    widgetX -= builderInfo.getWidth(height);
    widgets.push(builderInfo.getWidget({
      x: widgetX,
      y,
      height,
      panelColor,
      panelHoverColor,
    }));
  });

  const totalWidgetWidth = (
    2 * TOGGLE_BUTTON_WIDTH +
    widgetsBuildingInfo.right.reduce((acc, info) => acc + info.getWidth(height), 0) +
    widgetsBuildingInfo.left.reduce((acc, info) => acc + info.getWidth(height), 0)
  );

  widgets.push(windowListBuilder({
      x: endOfLeftWidgets,
      y,
      height,
      width: width - totalWidgetWidth,
  }));

  return {
    cleanupPriorToDelete,
  };
}
