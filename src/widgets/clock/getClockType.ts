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

import { validateConfig as validateDefaultClockParams } from './variants/defaultClock';
import { validateConfig as validateAnalogClockParams } from './variants/analogClock';
import { validateConfig as validateAnalogCirclesClockParams } from './variants/analogCirclesClock';

type ValidType = 'default' | 'analog-clock' | 'analog-circles-clock';
type ReturnType =
  | {
      type: ValidType;
      expectedArgument: undefined;
    }
  | {
      type: 'unknown';
      expectedArgument: string[];
    };

export function getClockType(unvalidatedWidgetConfig?: unknown): ReturnType {
  const checks = [
    { type: 'default' as const, checker: validateDefaultClockParams },
    { type: 'analog-clock' as const, checker: validateAnalogClockParams },
    {
      type: 'analog-circles-clock' as const,
      checker: validateAnalogCirclesClockParams,
    },
  ];

  let foundType: ValidType | undefined;
  let expectedArguments: string[] = [];

  checks.forEach((c) => {
    const check = c.checker(unvalidatedWidgetConfig);
    if (check.isValid) {
      foundType = c.type;
    } else {
      if (expectedArguments.length > 0) {
        expectedArguments.push('or');
      }
      expectedArguments.push(...check.expectedArgument);
    }
  });

  if (foundType !== undefined) {
    return {
      type: foundType,
      expectedArgument: undefined,
    };
  }

  return {
    type: 'unknown',
    expectedArgument: expectedArguments,
  };
}
