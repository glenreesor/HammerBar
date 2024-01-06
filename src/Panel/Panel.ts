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
  { x, y, width, height, widgetsBuildingInfo }:
  {
    x: number,
    y: number,
    width: number,
    height: number,
    widgetsBuildingInfo: {
      left: WidgetBuildingInfo[],
      right: WidgetBuildingInfo[],
    },
  }
): {
  destroy: () => void,
} {
  function destroy() {
    canvas.delete();
    toggleButtons.forEach((button) => button.destroy());
    widgets.forEach((widget) => widget.destroy());
  }

  function toggleVisibility() {
    state.isVisible = !state.isVisible;
    if (state.isVisible) {
      canvas.show();
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(true);
        button.bringToFront();
      });
      widgets.forEach((widget) => {
        widget.show();
        widget.bringToFront();
      });
    } else {
      canvas.hide();
      toggleButtons.forEach((button) => {
        button.setPanelVisibility(false);
        button.bringToFront();
      });
      widgets.forEach((widget) => {
        widget.hide();
      });
    }
  };
  const panelColor = { red: 100/255, green: 100/255, blue: 100/255 };
  const panelHoverColor = { red: 120/255, green: 120/255, blue: 120/255 };

  const canvas = hs.canvas.new({ x, y, w: width, h: height });
  canvas.replaceElements([
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
  canvas.show();

  const state = {
    isVisible: true,
  };

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
  let widgetX = TOGGLE_BUTTON_WIDTH;
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

  // Right Widgets
  widgetX = width - TOGGLE_BUTTON_WIDTH;
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

  return {
    destroy,
  };
}
