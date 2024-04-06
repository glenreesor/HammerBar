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

declare function print(this: void, text?: string | number): void;

declare namespace os {
  interface DateTable {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
    wkday: number;
    yday: number;
    isdst?: number;
  }

  function date(this: void, format: string, time?: number): string | DateTable;
  function getenv(this: void, envVariable: string): string;
}

declare namespace io {
  function popen(this: void, something: string, somethingElse: string): any;
}
