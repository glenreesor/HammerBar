// Copyright 2024, 2025 Glen Reesor
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
import type { WidgetConfig, State } from './types';
import { renderMainGraph, renderExpandedView } from './render';

export function buildLineGraphCurrentValueWidget(
  widgetConfig: WidgetConfig,
  widgetLayout: WidgetLayout,
) {
  function prepareForRemoval() {
    deleteCanvasesAndStopTimers(
      Object.values(state.canvases),
      Object.values(state.timers),
    );
  }

  function hide() {
    hideCanvases(Object.values(state.canvases));
  }

  function show() {
    showCanvases(Object.values(state.canvases));
  }

  function renderExpandedViewWithArgs() {
    renderExpandedView({
      widgetLayout,
      widgetConfig: widgetConfig,
      state,
      widgetWidth,
    });
  }

  function renderMainGraphWithArgs() {
    renderMainGraph({
      widgetLayout,
      widgetConfig: widgetConfig,
      state,
      widgetWidth,
      mouseCallback,
    });
  }

  const mouseCallback: hs.canvas.CanvasMouseCallback = function (
    this: void,
    _canvas: hs.canvas.Canvas,
    msg: 'mouseEnter' | 'mouseExit' | 'mouseDown' | 'mouseUp',
  ) {
    if (msg === 'mouseEnter') {
      state.mouseIsInside = true;
      renderMainGraphWithArgs();
    } else if (msg === 'mouseExit') {
      state.mouseIsInside = false;
      renderMainGraphWithArgs();
    } else if (msg === 'mouseDown') {
      state.mouseButtonIsDown = true;
      renderMainGraphWithArgs();
    } else if (msg === 'mouseUp') {
      state.mouseButtonIsDown = false;
      state.renderExpandedView = !state.renderExpandedView;

      if (
        !state.renderExpandedView &&
        state.canvases.expandedViewCanvas !== undefined
      ) {
        state.canvases.expandedViewCanvas.hide();
        state.canvases.expandedViewCanvas = undefined;
      }

      if (state.renderExpandedView) {
        renderExpandedViewWithArgs();
      }

      renderMainGraphWithArgs();
    }
  };

  function runCmdAndRender() {
    state.yValues.push(widgetConfig.cmd());
    state.yValues = state.yValues.slice(-1 * widgetConfig.maxValues);
    renderMainGraphWithArgs();

    if (state.renderExpandedView) {
      renderExpandedViewWithArgs();
    }

    state.timers.timer = hs.timer.doAfter(
      widgetConfig.interval,
      runCmdAndRender,
    );
  }

  const state: State = {
    canvases: {
      expandedViewCanvas: undefined,
      mainGraphCanvas: undefined,
    },
    timers: {
      timer: undefined,
    },
    mouseButtonIsDown: false,
    mouseIsInside: false,
    renderExpandedView: false,
    yValues: [],
  };

  const widgetWidth = widgetLayout.widgetHeight * 1.5;

  runCmdAndRender();

  return {
    width: widgetWidth,
    bringToFront: () => state.canvases.mainGraphCanvas?.show(),
    prepareForRemoval,
    hide: hide,
    show: show,
  };
}
