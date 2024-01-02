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

export default function Panel (
  { x, y, width, height, color, widgetBuilders }:
  {
    x: number,
    y: number,
    width: number,
    height: number,
    color: hs.ColorType,
    widgetBuilders:
      (
        ({ x, y , height }: { x: number, y: number, height: number }) => {
        bringToFront: () => void
        destroy: () => void,
        hide: () => void,
        show: () => void,
      })[],
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

  const canvas = hs.canvas.new({ x, y, w: width, h: height });
  canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: color,
      strokeColor: color,
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
    onClick: toggleVisibility
  }));

  // Right Toggle Button
  toggleButtons.push(ToggleButton({
    panelX: x,
    panelY: y,
    panelWidth: width,
    panelHeight: height,
    side: 'right',
    onClick: toggleVisibility
  }));

  const widgets: {
      bringToFront: () => void
      destroy: () => void,
      hide: () => void,
      show: () => void,
  }[] = [];

  let widgetX = TOGGLE_BUTTON_WIDTH;
  widgetBuilders.forEach((builder) => {
    widgets.push(builder({
      x: widgetX,
      y,
      height
    }));
    widgetX += 100;
  });

  return {
    destroy,
  };
}
