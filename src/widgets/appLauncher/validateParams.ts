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

const Config = v.object({
  bundleId: v.string().nonEmpty(),
  args: v.array(v.string()).optional(),
  hoverLabel: v.string().optional(),
});

export function validateParams(unvalidatedConfigParams: unknown): ReturnType {
  try {
    const validatedParams = Config.parse(unvalidatedConfigParams);
    return {
      isValid: true,
      validParams: validatedParams,
      expectedArgument: undefined,
    };
  } catch (e) {
    return {
      isValid: false,
      validParams: undefined,
      expectedArgument: [
        '{ bundleId = <BundleId> }',
        'or',
        '{',
        '  bundleId = <BundleId>',
        '  args = { <arg1, arg2, ...> }',
        '}',
      ],
    };
  }
}
