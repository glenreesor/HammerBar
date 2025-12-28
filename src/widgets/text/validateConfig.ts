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

const Config = v.object({
  title: v.string(),
  interval: v.number().positive(),
  cmd: v.fn(),
});

export function validateConfig(unvalidatedWidgetConfig: unknown): ReturnType {
  try {
    const validatedConfig = Config.parse(unvalidatedWidgetConfig);
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
        '    title = "The title",',
        '    interval = <a number>,',
        '    cmd = <a function that returns a string>,',
        '  }',
      ],
    };
  }
}
