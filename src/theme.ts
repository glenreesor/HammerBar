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
      foreground: { red: 255 / 255, green: 0 / 255, blue: 0 / 255 },
      background: { red: 0 / 255, green: 255 / 255, blue: 0 / 255 },
    },
    hover: {
      foreground: { red: 0 / 255, green: 0 / 255, blue: 255 / 255 },
      background: { red: 0 / 255, green: 155 / 255, blue: 0 / 255 },
    },
    // mouseDown: {
    //   foreground: { red: 1  , green: 1  , blue: 1   },
    //   background: { red: 0.5, green: 0.5, blue: 0.5 },
    // },
  },

  windowButtonsPanel: {
    background: { red: 255 / 255, green: 0 / 255, blue: 255 / 255 },
    windowButton: {
      normal: {
        foreground: { red: 0, green: 1, blue: 0 },
        background: { red: 0, green: 0, blue: 1 },
        border: { red: 1, green: 0, blue: 0 },
      },
      normalHover: {
        foreground: { red: 1, green: 0, blue: 0 },
        background: { red: 0, green: 1, blue: 0 },
        border: { red: 0, green: 0, blue: 1 },
      },
      minimized: {
        foreground: { red: 1, green: 0, blue: 1 },
        background: { red: 1, green: 1, blue: 1 },
        border: { red: 1, green: 1, blue: 0 },
      },
      minimizedHover: {
        foreground: { red: 0, green: 1, blue: 0 },
        background: { red: 1, green: 0, blue: 0 },
        border: { red: 1, green: 0, blue: 0 },
      },
      mouseDown: {
        foreground: { red: 1, green: 1, blue: 1 },
        background: { red: 0.5, green: 0.5, blue: 0.5 },
        border: { red: 1, green: 0, blue: 0 },
      },
    },
  },

  widget: {
    background: { red: 0.5, green: 0.5, blue: 0.5 },
    windowButton: {
      normal: {
        foreground: { red: 1, green: 1, blue: 1 },
        foregroundSecondary: { red: 1, green: 1, blue: 1 },
        background: { red: 0.5, green: 0.5, blue: 0.5 },
        backgroundSecondary: { red: 1, green: 1, blue: 1 },
      },
      hover: {
        foreground: { red: 1, green: 1, blue: 1 },
        foregroundSecondary: { red: 1, green: 1, blue: 1 },
        background: { red: 0.5, green: 0.5, blue: 0.5 },
        backgroundSecondary: { red: 1, green: 1, blue: 1 },
      },
      mouseDown: {
        foreground: { red: 1, green: 1, blue: 1 },
        foregroundSecondary: { red: 1, green: 1, blue: 1 },
        background: { red: 0.5, green: 0.5, blue: 0.5 },
        backgroundSecondary: { red: 1, green: 1, blue: 1 },
      },
    },
  },

  popup: {
    normal: {
      foreground: { red: 1, green: 1, blue: 1 },
      foregroundSecondary: { red: 1, green: 1, blue: 1 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
      backgroundSecondary: { red: 1, green: 1, blue: 1 },
      border: { red: 1, green: 1, blue: 1 },
    },
    hover: {
      foreground: { red: 1, green: 1, blue: 1 },
      foregroundSecondary: { red: 1, green: 1, blue: 1 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
      backgroundSecondary: { red: 1, green: 1, blue: 1 },
      border: { red: 1, green: 1, blue: 1 },
    },
    mouseDown: {
      foreground: { red: 1, green: 1, blue: 1 },
      foregroundSecondary: { red: 1, green: 1, blue: 1 },
      background: { red: 0.5, green: 0.5, blue: 0.5 },
      backgroundSecondary: { red: 1, green: 1, blue: 1 },
      border: { red: 1, green: 1, blue: 1 },
    },
  },

  tooltip: {
    foreground: { red: 1, green: 0, blue: 0 },
    background: { red: 0, green: 1, blue: 0 },
    border: { red: 0, green: 0, blue: 1 },
  },
};
