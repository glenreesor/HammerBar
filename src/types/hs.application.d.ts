// Copyright 2024, 2025 Glen Reesor
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

declare namespace hs.application {
  interface Application {
    allWindows(): hs.window.Window[];
    bundleID(): string | null;
    name(): string;
    hide(): boolean;
    unhide(): boolean;
  }

  function find(this: void, bundleId: string): Application | null;
  function launchOrFocusByBundleID(this: void, bundleId: string): boolean;
  function runningApplications(this: void): Application[];
}
