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
import type { ConfigParams } from './types';

export function renderTextWidget(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
  canvas: hs.canvas.CanvasType,
) {
  const width = builderParams.widgetHeight * 1.5;
  const fontSize = 12;
  const titleY = builderParams.widgetHeight / 2 - fontSize - fontSize / 2;
  const outputY = titleY + fontSize * 1.6;

  const output = configParams.cmd();

  canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: builderParams.panelHoverColor,
      strokeColor: builderParams.panelColor,
      frame: {
        x: 0,
        y: 0,
        w: width,
        h: builderParams.widgetHeight,
      },
    },
    {
      type: 'text',
      text: configParams.title,
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
}
