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

export type ConfigParams = {
  title: string;
  interval: number;
  maxValues: number;
  maxGraphValue: number | undefined;
  cmd: () => number;
};

export type State = {
  canvases: {
    expandedViewCanvas: hs.canvas.Canvas | undefined;
    mainGraphCanvas: hs.canvas.Canvas | undefined;
    hoverCanvas: hs.canvas.Canvas | undefined;
  };
  timers: {
    timer: hs.timer.Timer | undefined;
  };
  mouseButtonIsDown: boolean;
  mouseIsInside: boolean;
  renderExpandedView: boolean;
  renderHoverValue: boolean;
  yValues: number[];
};
