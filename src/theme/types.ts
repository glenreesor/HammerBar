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

type ForegroundBackground = {
  foreground: hs.canvas.Color;
  background: hs.canvas.Color;
};

type WindowButtonStyles = {
  foreground: hs.canvas.Color;
  background: hs.canvas.Color;
  border: hs.canvas.Color;
  iconAlpha: number;
};

type WidgetStyles = {
  foreground: hs.canvas.Color;
  foregroundSecondary: hs.canvas.Color;
  foregroundTertiary: hs.canvas.Color;
  background: hs.canvas.Color;
};

type PopupStyles = {
  foreground: hs.canvas.Color;
  foregroundSecondary: hs.canvas.Color;
  foregroundTertiary: hs.canvas.Color;
  background: hs.canvas.Color;
  backgroundSecondary: hs.canvas.Color;
  border: hs.canvas.Color;
};

export type Theme = {
  fontSize: number;
  height: number;
  panelBorder: {
    alpha: number;
    width: number;
    color: hs.canvas.Color;
  };

  toggleButtons: {
    alpha: number;
    normal: ForegroundBackground;
    hover: ForegroundBackground;
    mouseDown: ForegroundBackground;
  };

  windowButtonsPanel: {
    alpha: number;
    background: hs.canvas.Color;
    windowButton: {
      normal: WindowButtonStyles;
      normalHover: WindowButtonStyles;
      minimized: WindowButtonStyles;
      minimizedHover: WindowButtonStyles;
      mouseDown: WindowButtonStyles;
      activeIndicator: hs.canvas.Color;
    };
  };

  widget: {
    alpha: number;
    normal: WidgetStyles;
    hover: WidgetStyles;
    mouseDown: WidgetStyles;
  };

  popup: {
    alpha: number;
    normal: PopupStyles;
    hover: PopupStyles;
    mouseDown: PopupStyles;
  };

  tooltip: {
    alpha: number;
    foreground: hs.canvas.Color;
    background: hs.canvas.Color;
    border: hs.canvas.Color;
  };
};
