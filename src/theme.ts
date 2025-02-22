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

export const DEFAULT_THEME = {
  panelBorder: {
    alpha: 0.5,
    width: 5,
    color: { red: 0.5, green: 0, blue: 0.5 },
  },
  toggleButtons: {
    alpha: 1,
    normal: {
      foreground: { red: 0, green: 0, blue: 0 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
    },
    hover: {
      foreground: { red: 1, green: 1, blue: 1 },
      background: { red: 0, green: 0, blue: 0 },
    },
    mouseDown: {
      foreground: { red: 1, green: 0, blue: 0 },
      background: { red: 1, green: 1, blue: 1 },
    },
  },

  windowButtonsPanel: {
    alpha: 0.9,
    background: { red: 0.9, green: 0.9, blue: 0.9 },
    windowButton: {
      normal: {
        foreground: { red: 0, green: 0, blue: 0 },
        background: { red: 0.5, green: 0.5, blue: 0.5 },
        border: { red: 0.5, green: 0.5, blue: 0.5 },
        iconAlpha: 1,
      },
      normalHover: {
        foreground: { red: 1, green: 1, blue: 1 },
        background: { red: 0, green: 0, blue: 0 },
        border: { red: 0, green: 0, blue: 1 },
        iconAlpha: 0.5,
      },
      minimized: {
        foreground: { red: 0.5, green: 0.5, blue: 0.5 },
        background: { red: 0.8, green: 0.8, blue: 0.8 },
        border: { red: 1, green: 1, blue: 0 },
        iconAlpha: 1,
      },
      minimizedHover: {
        foreground: { red: 1, green: 0, blue: 0 },
        background: { red: 0, green: 0, blue: 1 },
        border: { red: 1, green: 0, blue: 0 },
        iconAlpha: 0.5,
      },
      mouseDown: {
        foreground: { red: 1, green: 0, blue: 0 },
        background: { red: 1, green: 1, blue: 1 },
        border: { red: 0, green: 1, blue: 0 },
        iconAlpha: 1,
      },
    },
  },

  widget: {
    alpha: 0.9,
    normal: {
      foreground: { red: 0, green: 0, blue: 0 },
      foregroundSecondary: { red: 0, green: 0, blue: 1 },
      foregroundTertiary: { red: 0, green: 1, blue: 0 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
      iconAlpha: 1,
    },
    hover: {
      foreground: { red: 1, green: 1, blue: 1 },
      foregroundSecondary: { red: 0, green: 1, blue: 0 },
      foregroundTertiary: { red: 1, green: 0, blue: 0 },
      background: { red: 0, green: 0, blue: 0 },
      iconAlpha: 0.5,
    },
    mouseDown: {
      foreground: { red: 1, green: 0, blue: 0 },
      foregroundSecondary: { red: 0, green: 0, blue: 0 },
      foregroundTertiary: { red: 0, green: 0, blue: 1 },
      background: { red: 1, green: 1, blue: 1 },
      iconAlpha: 1,
    },
  },

  popup: {
    alpha: 0.9,
    normal: {
      foreground: { red: 0, green: 0, blue: 0 },
      foregroundSecondary: { red: 0, green: 0, blue: 1 },
      foregroundTertiary: { red: 0, green: 1, blue: 0 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
      backgroundSecondary: { red: 0, green: 0, blue: 1 },
      border: { red: 1, green: 0, blue: 0 },
    },
    hover: {
      foreground: { red: 1, green: 1, blue: 1 },
      foregroundSecondary: { red: 0, green: 1, blue: 0 },
      foregroundTertiary: { red: 1, green: 0, blue: 0 },
      background: { red: 0, green: 0, blue: 0 },
      backgroundSecondary: { red: 0, green: 1, blue: 1 },
      border: { red: 1, green: 0, blue: 0 },
    },
    mouseDown: {
      foreground: { red: 1, green: 0, blue: 0 },
      foregroundSecondary: { red: 0, green: 0, blue: 0 },
      foregroundTertiary: { red: 0, green: 0, blue: 1 },
      background: { red: 1, green: 1, blue: 1 },
      backgroundSecondary: { red: 1, green: 1, blue: 1 },
      border: { red: 1, green: 0, blue: 0 },
    },
  },

  tooltip: {
    alpha: 0.9,
    foreground: { red: 1, green: 0, blue: 0 },
    background: { red: 0, green: 1, blue: 0 },
    border: { red: 0, green: 0, blue: 1 },
  },
};
