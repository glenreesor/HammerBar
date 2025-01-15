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
  panel: {
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
    background: { red: 0.8, green: 0.8, blue: 0.8 },
    windowButton: {
      normal: {
        foreground: { red: 0, green: 0, blue: 0 },
        background: { red: 0.5, green: 0.5, blue: 0.5 },
        border: { red: 1, green: 0, blue: 0 },
      },
      normalHover: {
        foreground: { red: 1, green: 1, blue: 1 },
        background: { red: 0, green: 0, blue: 0 },
        border: { red: 0, green: 0, blue: 1 },
      },
      minimized: {
        foreground: { red: 0.5, green: 0.5, blue: 0.5 },
        background: { red: 0.8, green: 0.8, blue: 0.8 },
        border: { red: 1, green: 1, blue: 0 },
      },
      minimizedHover: {
        foreground: { red: 1, green: 0, blue: 0 },
        background: { red: 0, green: 0, blue: 1 },
        border: { red: 1, green: 0, blue: 0 },
      },
      mouseDown: {
        foreground: { red: 1, green: 0, blue: 0 },
        background: { red: 1, green: 1, blue: 1 },
        border: { red: 0, green: 1, blue: 0 },
      },
    },
  },

  widget: {
    normal: {
      foreground: { red: 0, green: 0, blue: 0 },
      foregroundSecondary: { red: 0, green: 0, blue: 1 },
      foregroundTertiary: { red: 0, green: 1, blue: 0 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
    },
    hover: {
      foreground: { red: 1, green: 1, blue: 1 },
      foregroundSecondary: { red: 0, green: 1, blue: 0 },
      foregroundTertiary: { red: 1, green: 0, blue: 0 },
      background: { red: 0, green: 0, blue: 0 },
    },
    mouseDown: {
      foreground: { red: 1, green: 0, blue: 0 },
      foregroundSecondary: { red: 0, green: 0, blue: 0 },
      foregroundTertiary: { red: 0, green: 0, blue: 1 },
      background: { red: 1, green: 1, blue: 1 },
    },
  },

  popup: {
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
    foreground: { red: 1, green: 0, blue: 0 },
    background: { red: 0, green: 1, blue: 0 },
    border: { red: 0, green: 0, blue: 1 },
  },
};
