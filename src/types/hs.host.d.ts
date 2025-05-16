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

declare namespace hs.host {
  // Yes this is the actual return type. Wow.
  type CpuUsageReturnStats = {
    user: number;
    system: number;
    nice: number;
    active: number;
    idle: number;
  }[] & {
    n: number;
    overall: {
      user: number;
      system: number;
      nice: number;
      active: number;
      idle: number;
    };
  };

  function cpuUsage(
    this: void,
    period?: number,
    callback?: (this: void, result: CpuUsageReturnStats) => void,
  ): {
    finished(): boolean;
    stop(): void;
  };

  namespace locale {
    function current(this: void): string;
    function details(
      this: void,
      identifier?: string,
    ): {
      // Lots of other keys are returned. Only listing the ones I need
      calendar: {
        AMSymbol: string;
        PMSymbol: string;
        shortMonthSymbols: string[];
        shortWeekdaySymbols: string[];
      };
      timeFormatIs24Hour: boolean;
    };
  }
}
