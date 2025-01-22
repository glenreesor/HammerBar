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

import { BLACK } from 'src/constants';
import type { WidgetBuilderParams } from 'src/mainPanel';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from '../helpers/util';

const CLOCK_WIDTH = 100;

export function buildClockWidget({
  coords,
  widgetHeight,
}: WidgetBuilderParams) {
  function cleanupPriorToDelete() {
    deleteCanvasesAndStopTimers([state.canvas], [state.timer]);
  }

  function hide() {
    hideCanvases([state.canvas]);
  }

  function show() {
    showCanvases([state.canvas]);
  }

  function getFormattedDateTime(): {
    formattedTime: string;
    formattedDate: string;
  } {
    const now = os.date('*t') as os.DateTable;

    const hour = now.hour < 13 ? now.hour : now.hour - 12;
    const minute = `${now.min < 10 ? '0' : ''}${now.min}`;
    const ampm = now.hour < 12 ? 'am' : 'pm';

    const year = now.year;
    const month = `${now.month < 10 ? '0' : ''}${now.month}`;
    const day = `${now.day < 10 ? '0' : ''}${now.day}`;

    return {
      formattedTime: `${hour}:${minute} ${ampm}`,
      formattedDate: `${year}-${month}-${day}`,
    };
  }

  function render() {
    const bgColor = { red: 1, green: 1, blue: 1 };
    const { formattedTime, formattedDate } = getFormattedDateTime();
    const fontSize = 12;
    const timeY = widgetHeight / 2 - fontSize - fontSize / 2;
    const dateY = timeY + fontSize * 1.6;

    state.canvas?.replaceElements([
      {
        type: 'rectangle',
        fillColor: bgColor,
        strokeColor: bgColor,
        frame: {
          x: 0,
          y: 0,
          w: CLOCK_WIDTH,
          h: widgetHeight,
        },
      },
      {
        type: 'text',
        text: formattedTime,
        textAlignment: 'center',
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: 0,
          y: timeY,
          w: CLOCK_WIDTH,
          h: fontSize * 1.2,
        },
      },
      {
        type: 'text',
        text: formattedDate,
        textAlignment: 'center',
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: 0,
          y: dateY,
          w: CLOCK_WIDTH,
          h: fontSize * 1.2,
        },
      },
    ]);
  }
  const state: {
    canvas: hs.canvas.CanvasType | undefined;
    timer: hs.timer.TimerType | undefined;
  } = {
    canvas: undefined,
    timer: undefined,
  };

  state.canvas = hs.canvas.new({
    x: coords.x,
    y: coords.y,
    w: CLOCK_WIDTH,
    h: widgetHeight,
  });

  render();
  state.canvas.show();

  // Schedule clock updates every minute starting at 0s of the next minute
  // and every 60s thereafter
  const now = os.date('*t') as os.DateTable;
  state.timer = hs.timer.doAfter(60 - now.sec, () => {
    render();
    state.timer = hs.timer.doEvery(60, render);
  });

  return {
    bringToFront: () => state.canvas?.show(),
    cleanupPriorToDelete,
    hide,
    show,
  };
}
