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

const CLOCK_WIDTH = 100;

export function buildDefaultClockWidget(builderParams: WidgetBuilderParams) {
  const { coords, widgetHeight } = builderParams;

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
      canvas: state.canvas,
      width: CLOCK_WIDTH,
      height: widgetHeight,
    });
  }

  const canvasX = coords.leftX ?? coords.rightX - CLOCK_WIDTH;
  state.canvas = hs.canvas.new({
    x: canvasX,
    y: coords.y,
    w: CLOCK_WIDTH,
    h: widgetHeight,
  });

  renderWithArgs();

  state.canvas.show();

  const now = os.date('*t') as os.DateTable;
  state.timer = hs.timer.doAfter(60 - now.sec, () => {
    renderWithArgs();
    state.timer = hs.timer.doEvery(60, renderWithArgs);
  });

  return {
    width: CLOCK_WIDTH,
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    hide,
    show,
  };
}
