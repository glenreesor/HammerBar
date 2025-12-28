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

import { validator as v } from 'src/util';
import type { WidgetConfig } from './types';

type ReturnType =
  | {
      isValid: true;
      validConfig: WidgetConfig;
      expectedArgument: undefined;
    }
  | {
      isValid: false;
      validConfig: undefined;
      expectedArgument: string[];
    };

const Config1 = v.object({
  type: v.literal('graph'),
  interval: v.number().positive(),
  maxValues: v.number().positive(),
});

const Config2 = v.object({
  type: v.literal('text'),
  interval: v.number().positive(),
});

export function validateConfig(unvalidatedWidgetConfig: unknown): ReturnType {
  try {
    const validatedConfig = Config1.parse(unvalidatedWidgetConfig);
    return {
      isValid: true,
      validConfig: validatedConfig,
      expectedArgument: undefined,
    };
  } catch {
    try {
      const validatedConfig = Config2.parse(unvalidatedWidgetConfig);
      return {
        isValid: true,
        validConfig: validatedConfig,
        expectedArgument: undefined,
      };
    } catch {
      return {
        isValid: false,
        validConfig: undefined,
        expectedArgument: [
          '  {',
          '    type = "graph"',
          '    interval = <a number>,',
          '    maxValues: <a number>,',
          '  }',
          '  or',
          '  {',
          '    type = "text"',
          '    interval = <a number>,',
          '  }',
        ],
      };
    }
  }
}
