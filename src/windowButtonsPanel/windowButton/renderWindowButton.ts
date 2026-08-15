// Copyright 2025, 2026 Glen Reesor
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

import type { State } from './types';
import { getTheme } from 'src/theme';

export function renderWindowButton(state: State) {
  const theme = getTheme();
  let borderWidth;
  let fontSize;
  let iconHeight;
  let iconWidth;
  let iconY;
  let textPaddingLeft;
  let textPaddingRight;

  const LEFT_PADDING = 5;

  const panelHeight = state.canvases.mainCanvas?.frame().h || 0;
  const buttonVerticalPadding = 6;

  const buttonHeight = panelHeight - 2 * buttonVerticalPadding;

  if (state.mouseIsInsideButton) {
    borderWidth = 4;
  } else {
    borderWidth = 0;
  }

  if (state.mouseButtonIsDown) {
    fontSize = theme.fontSize * 0.8;
    iconWidth = 0.8 * buttonHeight;
    iconHeight = iconWidth;
    iconY = buttonVerticalPadding + 0.1 * buttonHeight;
    textPaddingLeft = 2 + 0.2 * buttonHeight;
    textPaddingRight = 5;
  } else {
    fontSize = theme.fontSize;
    iconWidth = buttonHeight;
    iconHeight = iconWidth;
    iconY = buttonVerticalPadding;
    textPaddingLeft = 2;
    textPaddingRight = 5;
  }

  let colors = theme.windowButtonsPanel.windowButton.normal;

  if (
    !state.windowState.isMinimized &&
    !state.mouseButtonIsDown &&
    state.mouseIsInsideButton
  ) {
    colors = theme.windowButtonsPanel.windowButton.normalHover;
  }

  if (
    state.windowState.isMinimized &&
    !state.mouseButtonIsDown &&
    !state.mouseIsInsideButton
  ) {
    colors = theme.windowButtonsPanel.windowButton.minimized;
  }

  if (
    state.windowState.isMinimized &&
    !state.mouseButtonIsDown &&
    state.mouseIsInsideButton
  ) {
    colors = theme.windowButtonsPanel.windowButton.minimizedHover;
  }

  if (state.mouseButtonIsDown) {
    colors = theme.windowButtonsPanel.windowButton.mouseDown;
  }

  const borderColor = colors.border;
  const bgColor = colors.background;
  const fgColor = colors.foreground;
  const iconAlpha = colors.iconAlpha;

  const textX = LEFT_PADDING + textPaddingLeft + iconWidth;

  const textY = buttonVerticalPadding + 2;

  const maxTextWidth =
    state.buttonGeometry.width -
    LEFT_PADDING -
    textPaddingLeft -
    iconWidth -
    textPaddingRight;

  const isFocused = state.windowState.isFocused;

  state.canvases.mainCanvas?.replaceElements([
    {
      type: 'rectangle',
      fillColor: theme.windowButtonsPanel.background,
      strokeColor: theme.windowButtonsPanel.background,
      frame: {
        x: 0,
        y: 0,
        w: state.buttonGeometry.width,
        h: panelHeight,
      },
    },
    {
      type: 'rectangle',
      fillColor: bgColor,
      strokeColor: borderColor,
      strokeWidth: borderWidth,
      frame: {
        x: LEFT_PADDING,
        y: buttonVerticalPadding,
        w: state.buttonGeometry.width - LEFT_PADDING,
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
        x: LEFT_PADDING + textPaddingLeft,
        y: iconY,
        w: iconWidth,
        h: iconWidth,
      },
      image: state.windowState.getAppIcon(),
      imageAlpha: iconAlpha,
    },
    {
      type: 'text',
      text: state.windowState.title,
      textColor: fgColor,
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
        strokeColor: theme.windowButtonsPanel.windowButton.activeIndicator,
        strokeWidth: 2,
        strokeCapStyle: 'round',
        coordinates: [
          {
            x: LEFT_PADDING + 4,
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
