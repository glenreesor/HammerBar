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

import type { WidgetLayout } from 'src/mainPanel';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from '../_helpers/util';
import type { WidgetConfig } from './types';
import { renderTextWidget } from './renderTextWidget';

export function buildTextWidget(
  widgetConfig: WidgetConfig,
  widgetLayout: WidgetLayout,
) {
  type State = {
    canvas: hs.canvas.Canvas | undefined;
    timer: hs.timer.Timer | undefined;
  };

  const state: State = {
    canvas: undefined,
    timer: undefined,
  };

  const width = widgetLayout.widgetHeight * 1.5;
  const canvasX =
    widgetLayout.coords.leftX ?? widgetLayout.coords.rightX - width;

  state.canvas = hs.canvas.new({
    x: canvasX,
    y: widgetLayout.coords.y,
    w: width,
    h: widgetLayout.widgetHeight,
  });

  state.canvas.show();
  state.timer = hs.timer.doEvery(widgetConfig.interval, () => {
    if (state.canvas) {
      renderTextWidget(widgetConfig, widgetLayout, state.canvas);
    }
  });

  function prepareForRemoval() {
    deleteCanvasesAndStopTimers([state.canvas], [state.timer]);
  }

  function hide() {
    hideCanvases([state.canvas]);
  }

  function show() {
    showCanvases([state.canvas]);
  }

  renderTextWidget(widgetConfig, widgetLayout, state.canvas);

  return {
    width,
    bringToFront: () => state.canvas?.show(),
    prepareForRemoval,
    hide,
    show,
  };
}
