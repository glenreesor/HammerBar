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
import type { ConfigParams } from './types';

type ReturnType =
  | {
      isValid: true;
      validParams: ConfigParams;
      expectedArgument: undefined;
    }
  | {
      isValid: false;
      validParams: undefined;
      expectedArgument: string[];
    };

const ConfigShape1 = v.object({
  appList: v
    .array(
      v.object({
        bundleId: v.string(),
        label: v.string(),
        args: v.array(v.string()).optional(),
      }),
    )
    .nonEmpty(),
  icon: v
    .object({
      bundleId: v.string(),
      imagePath: v.literal(undefined).optional(),
    })
    .optional(),
});

const ConfigShape2 = v.object({
  appList: v
    .array(
      v.object({
        bundleId: v.string(),
        label: v.string(),
        args: v.array(v.string()).optional(),
      }),
    )
    .nonEmpty(),
  icon: v
    .object({
      bundleId: v.literal(undefined).optional(),
      imagePath: v.string(),
    })
    .optional(),
});

export function validateParams(unvalidatedConfigParams: unknown): ReturnType {
  try {
    const validatedParams = ConfigShape1.parse(unvalidatedConfigParams);

    return {
      isValid: true,
      validParams: validatedParams,
      expectedArgument: undefined,
    };
  } catch {
    try {
      const validatedParams = ConfigShape2.parse(unvalidatedConfigParams);

      return {
        isValid: true,
        validParams: validatedParams,
        expectedArgument: undefined,
      };
    } catch {
      return {
        isValid: false,
        validParams: undefined,
        expectedArgument: [
          '  {',
          '    { bundleId = "org.mozilla.firefox", label = "Firefox" },',
          '    { bundleId = "com.google.Chrome", label = "Chrome" },',
          '  }',
        ],
      };
    }
  }
}
