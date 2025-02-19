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
} from '../../../_helpers/util';
import { render } from './render';
import type { ConfigParams } from './types';

export function buildAnalogCirclesClockWidget(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
) {
  const { coords, widgetHeight } = builderParams;
  const clockWidth = builderParams.widgetHeight;

  function cleanupPriorToDelete() {
    deleteCanvasesAndStopTimers([state.canvas], [state.timer]);
  }

  function hide() {
    hideCanvases([state.canvas]);
  }

  function show() {
    showCanvases([state.canvas]);
  }

  const state: {
    canvas: hs.canvas.CanvasType | undefined;
    timer: hs.timer.TimerType | undefined;
  } = {
    canvas: undefined,
    timer: undefined,
  };

  function renderWithArgs() {
    if (!state.canvas) {
      return;
    }

    render({
      configParams,
      canvas: state.canvas,
      width: clockWidth,
      height: widgetHeight,
    });
  }

  const canvasX = coords.leftX ?? coords.rightX - clockWidth;
  state.canvas = hs.canvas.new({
    x: canvasX,
    y: coords.y,
    w: clockWidth,
    h: widgetHeight,
  });

  state.canvas.show();
  renderWithArgs();

  const now = os.date('*t') as os.DateTable;
  const nextUpdate = configParams?.showSeconds ? 1 : 60 - now.sec;
  const updateInterval = configParams?.showSeconds ? 1 : 60;

  state.timer = hs.timer.doAfter(nextUpdate, () => {
    renderWithArgs();
    state.timer = hs.timer.doEvery(updateInterval, renderWithArgs);
  });

  return {
    width: clockWidth,
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    hide,
    show,
  };
}
