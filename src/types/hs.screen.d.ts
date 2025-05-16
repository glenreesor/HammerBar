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

declare namespace hs.screen {
  interface Screen {
    frame(): Frame;
    id(): number;
    name(): string;
  }

  function allScreens(this: void): Screen[];
  function primaryScreen(this: void): Screen;
}

declare namespace hs.screen.watcher {
  interface Watcher {
    start(): Watcher;
    stop(): Watcher;
  }

  // Can't declare "function new" since "new" is a TS
  // keyword, so use this workaround of declaring as
  // "new_" then exporting as "new"
  function new_(this: void, watcherFn: () => void): Watcher;

  export { new_ as new, Watcher };
}
