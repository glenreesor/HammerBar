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

function isConfigParams(obj: unknown): obj is ConfigParams {
  return isGraphMonitor(obj) || isTextMonitor(obj);
}

function isGraphMonitor(obj: unknown): obj is ConfigParams {
  if (typeof obj !== 'object') {
    return false;
  }

  const typedObj = obj as ConfigParams;

  if (typedObj.type !== 'graph') {
    return false;
  }

  if (typeof typedObj.interval !== 'number' || typedObj.interval <= 0) {
    return false;
  }

  if (typeof typedObj.maxValues !== 'number' || typedObj.maxValues <= 0) {
    return false;
  }

  return true;
}

function isTextMonitor(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    (obj as ConfigParams).type === 'text' &&
    typeof (obj as ConfigParams).interval === 'number' &&
    (obj as ConfigParams).interval > 0
  );
}
