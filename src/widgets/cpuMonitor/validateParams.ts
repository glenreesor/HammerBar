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

export function validateParams(unvalidatedConfigParams: unknown): ReturnType {
  if (isConfigParams(unvalidatedConfigParams)) {
    return {
      isValid: true,
      validParams: unvalidatedConfigParams,
      expectedArgument: undefined,
    };
  }

  return {
    isValid: false,
    validParams: undefined,
    expectedArgument: [
      '  {',
      '    interval = <a number>,',
      '    maxValues: <a number>,',
      '    maxGraphValue: <a number or nil>,',
      '  }',
    ],
  };
}

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    typeof (obj as ConfigParams).interval === 'number' &&
    (obj as ConfigParams).interval > 0 &&
    typeof (obj as ConfigParams).maxValues === 'number' &&
    (obj as ConfigParams).maxValues > 0 &&
    ((typeof (obj as ConfigParams).maxGraphValue === 'number' &&
      ((obj as ConfigParams).maxGraphValue as number) > 0) ||
      typeof (obj as ConfigParams).maxGraphValue === 'undefined') &&
    (Object.keys(obj as ConfigParams).length === 2 ||
      Object.keys(obj as ConfigParams).length === 3)
  );
}
