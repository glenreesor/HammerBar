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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/panel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from './helpers/util';
import { DEFAULT_THEME } from 'src/theme';

type ConfigParams = {
  title: string;
  interval: number;
  cmd: () => string;
};

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    typeof (obj as ConfigParams).title === 'string' &&
    typeof (obj as ConfigParams).interval === 'number' &&
    typeof (obj as ConfigParams).cmd === 'function'
  );
}

export function getTextBuilder(
  unvalidatedConfigParams: unknown,
): WidgetBuildingInfo {
  if (!isConfigParams(unvalidatedConfigParams)) {
    return getNoopWidgetBuildingInfo('Text', [
      'Unexpected argument. Expecting an argument like this:',
      '',
      '  {',
      '    title = "The title",',
      '    interval = <a number>,',
      '    cmd = <a function that returns a string>,',
      '  }',
      '',
      'But instead this was received:',
      '',
      hs.inspect.inspect(unvalidatedConfigParams),
    ]);
  }

  // This looks goofy because the type checking should suffice since it
  // correctly narrows the type of unvalidatedBundleId.
  //
  // However it appears that typescript doesn't maintain that knowledge
  // within the function below.
  const configParams = unvalidatedConfigParams;

  function getTextWidget({ coords, height }: WidgetBuilderParams) {
    function cleanupPriorToDelete() {
      deleteCanvasesAndStopTimers([state.canvas], [state.timer]);
    }

    function hide() {
      hideCanvases([state.canvas]);
    }

    function show() {
      showCanvases([state.canvas]);
    }

    function render() {
      const fontSize = 12;
      const titleY = height / 2 - fontSize - fontSize / 2;
      const outputY = titleY + fontSize * 1.6;

      const output = configParams.cmd();

      state.canvas?.replaceElements([
        {
          type: 'rectangle',
          fillColor: DEFAULT_THEME.widget.normal.background,
          strokeColor: DEFAULT_THEME.widget.normal.background,
          frame: {
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
        },
        {
          type: 'text',
          text: configParams.title,
          textAlignment: 'center',
          textColor: DEFAULT_THEME.widget.normal.foreground,
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
          textColor: DEFAULT_THEME.widget.normal.foreground,
          textSize: fontSize,
          frame: {
            x: 0,
            y: outputY,
            w: width,
            h: fontSize * 1.2,
          },
        },
      ]);

      state.timer = hs.timer.doAfter(configParams.interval, render);
    }

    const state: {
      canvas: hs.canvas.CanvasType | undefined;
      timer: hs.timer.TimerType | undefined;
    } = {
      canvas: undefined,
      timer: undefined,
    };

    const width = height * 1.5;
    state.canvas = hs.canvas.new({
      x: coords.x,
      y: coords.y,
      w: width,
      h: height,
    });

    state.canvas.alpha(DEFAULT_THEME.widget.alpha);

    render();
    state.canvas.show();

    return {
      bringToFront: () => state.canvas?.show(),
      cleanupPriorToDelete,
      hide,
      show,
    };
  }

  return {
    buildErrors: [],
    name: 'Text',
    getWidth: (widgetHeight) => widgetHeight * 1.5,
    getWidget: getTextWidget,
  };
}
