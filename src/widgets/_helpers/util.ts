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

export function deleteCanvasesAndStopTimers(
  canvases: (hs.canvas.CanvasType | undefined)[],
  timers: (hs.timer.TimerType | undefined)[],
) {
  // Hide canvases then unset them so they'll be garbage collected
  // This approach (garbage collection) is suggested by HammerSpoon docs
  canvases.forEach((c) => {
    c?.hide();
    c = undefined;
  });

  timers.forEach((t) => t?.stop());
}

export function hideCanvases(canvases: (hs.canvas.CanvasType | undefined)[]) {
  canvases.forEach((c) => c?.hide());
}

export function showCanvases(canvases: (hs.canvas.CanvasType | undefined)[]) {
  canvases.forEach((c) => c?.show());
}
