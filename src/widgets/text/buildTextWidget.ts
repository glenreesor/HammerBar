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

import type { WidgetBuilderParams } from 'src/mainPanel';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from '../_helpers/util';
import type { ConfigParams } from './types';
import { renderTextWidget } from './renderTextWidget';

export function buildTextWidget(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
) {
  type State = {
    canvas: hs.canvas.CanvasType | undefined;
    timer: hs.timer.TimerType | undefined;
  };

  const state: State = {
    canvas: undefined,
    timer: undefined,
  };

  const width = builderParams.widgetHeight * 1.5;
  const canvasX =
    builderParams.coords.leftX ?? builderParams.coords.rightX - width;

  state.canvas = hs.canvas.new({
    x: canvasX,
    y: builderParams.coords.y,
    w: width,
    h: builderParams.widgetHeight,
  });

  state.canvas.show();
  state.timer = hs.timer.doEvery(configParams.interval, () => {
    if (state.canvas) {
      renderTextWidget(configParams, builderParams, state.canvas);
    }
  });

  function cleanupPriorToDelete() {
    deleteCanvasesAndStopTimers([state.canvas], [state.timer]);
  }

  function hide() {
    hideCanvases([state.canvas]);
  }

  function show() {
    showCanvases([state.canvas]);
  }

  renderTextWidget(configParams, builderParams, state.canvas);

  return {
    width,
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    hide,
    show,
  };
}
