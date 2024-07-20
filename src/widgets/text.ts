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

import { BLACK } from 'src/constants';
import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';

export function getTextBuilder(args: {
  title: string;
  interval: number;
  cmd: () => string;
}): WidgetBuildingInfo {
  const buildErrors: string[] = [];

  function getTextWidget({
    x,
    y,
    height,
    panelColor,
    panelHoverColor,
  }: WidgetBuilderParams) {
    function cleanupPriorToDelete() {
      state.canvas?.hide();
      state.canvas = undefined;

      state.timer?.stop();
    }

    function render() {
      const fontSize = 12;
      const titleY = height / 2 - fontSize - fontSize / 2;
      const outputY = titleY + fontSize * 1.6;

      const output = args.cmd();

      state.canvas?.replaceElements([
        {
          type: 'rectangle',
          fillColor: panelHoverColor,
          strokeColor: panelColor,
          frame: {
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
        },
        {
          type: 'text',
          text: args.title,
          textAlignment: 'center',
          textColor: BLACK,
          textSize: fontSize,
          frame: {
            x: 0,
            y: titleY,
            w: width,
            h: fontSize * 1.2,
          },
        },
        {
          type: 'text',
          text: output,
          textAlignment: 'center',
          textColor: BLACK,
          textSize: fontSize,
          frame: {
            x: 0,
            y: outputY,
            w: width,
            h: fontSize * 1.2,
          },
        },
      ]);

      state.timer = hs.timer.doAfter(args.interval, render);
    }

    const state: {
      canvas: hs.CanvasType | undefined;
      timer: hs.TimerType | undefined;
    } = {
      canvas: undefined,
      timer: undefined,
    };

    const width = height * 1.5;
    state.canvas = hs.canvas.new({ x, y, w: width, h: height });

    render();
    state.canvas.show();

    return {
      bringToFront: () => state.canvas?.show(),
      cleanupPriorToDelete,
      hide: () => state.canvas?.hide(),
      show: () => state.canvas?.show(),
    };
  }

  return {
    buildErrors,
    name: 'Text',
    getWidth: (widgetHeight) => widgetHeight * 1.5,
    getWidget: getTextWidget,
  };
}
