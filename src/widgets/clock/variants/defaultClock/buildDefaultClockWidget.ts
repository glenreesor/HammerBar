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
import { ConfigParams } from './types';

const CLOCK_WIDTH = 100;

export function buildDefaultClockWidget(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
) {
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
    canvas: hs.canvas.Canvas | undefined;
    timer: hs.timer.Timer | undefined;
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
      width: CLOCK_WIDTH,
      height: widgetHeight,
    });
  }

  // The embedded lua runtime uses 'C' for the locale, which won't
  // give us nicely formatted dates. So set the locale to match
  // the system's. But only if the lua one isn't already set,
  // on the off chance user has already set it to something else.
  if (!os.setlocale()) {
    os.setlocale(hs.host.locale.current());
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

  const updateInterval =
    configParams?.timeFormat && configParams.timeFormat.includes('ss') ? 1 : 60;

  const now = os.date('*t') as os.DateTable;

  if (updateInterval === 1) {
    state.timer = hs.timer.doEvery(1, renderWithArgs);
  } else {
    state.timer = hs.timer.doAfter(60 - now.sec, () => {
      renderWithArgs();
      state.timer = hs.timer.doEvery(updateInterval, renderWithArgs);
    });
  }

  return {
    width: CLOCK_WIDTH,
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    hide,
    show,
  };
}
