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

declare function print(this: void, ...args: any[]): void;

declare namespace os {
  type DateTable = {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
    wday: number;
    yday: number;
    isdst?: number;
  };

  function date(this: void, format: '*t', time?: number): DateTable;
  function date(this: void, format: string, time?: number): string;
  function getenv(this: void, envVariable: string): string;
  function setlocale(this: void, localeName?: string): string | undefined;
}

declare namespace io {
  type FileHandle = {
    // There are other keys on this object. Just typing the ones we need
    close: () => void;

    // Lua supports formats other than 'a', however we only need 'a' and I don't
    // want to figure out the typing for the others :-)
    read: (format: 'a') => string;
  };

  function popen(this: void, cmd: string, mode?: 'r' | 'w'): FileHandle;
}
