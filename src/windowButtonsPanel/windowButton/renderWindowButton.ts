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
import type { State } from './types';

export function renderWindowButton(state: State) {
  let borderWidth;
  let fontSize;
  let iconHeight;
  let iconWidth;
  let iconY;
  let paddingLeft;
  let paddingRight;

  const panelHeight = state.canvases.mainCanvas?.frame().h || 0;
  const buttonVerticalPadding = 6;

  const buttonHeight = panelHeight - 2 * buttonVerticalPadding;

  if (state.mouseIsInsideButton) {
    borderWidth = 4;
  } else {
    borderWidth = 0;
  }

  if (state.mouseButtonIsDown) {
    fontSize = 10;
    iconWidth = 0.8 * buttonHeight;
    iconHeight = iconWidth;
    iconY = buttonVerticalPadding + 0.1 * buttonHeight;
    paddingLeft = 2 + 0.2 * buttonHeight;
    paddingRight = 5;
  } else {
    fontSize = 12;
    iconWidth = buttonHeight;
    iconHeight = iconWidth;
    iconY = buttonVerticalPadding;
    paddingLeft = 2;
    paddingRight = 5;
  }

  const borderColor = { red: 0.5, green: 0.5, blue: 0.5 };

  const bgColor = state.windowState.isMinimized
    ? { red: 0.7, green: 0.7, blue: 0.7 }
    : { red: 1, green: 1, blue: 1 };

  const textX = paddingLeft + iconWidth;

  const textY = buttonVerticalPadding + 2;

  const maxTextWidth =
    state.buttonGeometry.width - paddingLeft - iconWidth - paddingRight;

  const isFocused = state.windowState.isFocused;

  state.canvases.mainCanvas?.replaceElements([
    {
      type: 'rectangle',
      fillColor: bgColor,
      strokeColor: borderColor,
      strokeWidth: borderWidth,
      frame: {
        x: 0,
        y: buttonVerticalPadding,
        w: state.buttonGeometry.width,
        h: buttonHeight,
      },
      roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      trackMouseDown: true,
      trackMouseEnterExit: true,
      trackMouseUp: true,
    },
    {
      type: 'image',
      frame: {
        x: paddingLeft,
        y: iconY,
        w: iconWidth,
        h: iconWidth,
      },
      image: state.windowState.getAppIcon(),
    },
    {
      type: 'text',
      text: state.windowState.title,
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: textX,
        y: textY,
        w: maxTextWidth,
        h: buttonHeight,
      },
    },
  ]);

  if (isFocused) {
    state.canvases.mainCanvas?.appendElements([
      {
        type: 'segments',
        strokeColor: { red: 0, green: 0, blue: 1 },
        strokeWidth: 2,
        strokeCapStyle: 'round',
        coordinates: [
          {
            x: 4,
            y: buttonVerticalPadding + buttonHeight + 3,
          },
          {
            x: state.buttonGeometry.width - 4,
            y: buttonVerticalPadding + buttonHeight + 3,
          },
        ],
      },
    ]);
  }
}
