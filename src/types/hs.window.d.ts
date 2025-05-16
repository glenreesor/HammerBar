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

declare namespace hs.window {
  interface Window {
    application(): hs.application.Application | null;
    focus(): void;
    frame(): hs.Frame;
    id(): number;
    isMinimized(): boolean;
    isStandard(): boolean;
    minimize(): void;
    raise(): void;
    role(): string;
    screen(): hs.screen.Screen;
    setFrame({ x, y, w, h }: hs.Frame): void;
    snapshot(): hs.image.Image | undefined;
    subrole(): string;
    title(): string;
    unminimize(): void;
  }

  function allWindows(this: void): Window[];
  function focusedWindow(this: void): Window;
  function get(this: void, windowId: number): Window | undefined;
  function orderedWindows(this: void): Window[];
}
