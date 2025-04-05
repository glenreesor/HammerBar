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

export function validateParams(unvalidatedConfigParams?: unknown): ReturnType {
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
      'nil',
      'or',
      '{',
      '    dateFormat: <format string>, (optional)',
      '    timeFormat: <format string>. (optional)',
    ],
  };
}

function isConfigParams(obj?: unknown): obj is ConfigParams {
  if (obj === undefined) {
    return true;
  }

  if (typeof obj === 'object' && obj !== null) {
    let isValid = true;

    Object.keys(obj).forEach((k) => {
      if (!['dateFormat', 'timeFormat'].includes(k)) {
        isValid = false;
      }
    });

    if ('dateFormat' in obj && typeof obj.dateFormat !== 'string') {
      isValid = false;
    }

    if ('timeFormat' in obj && typeof obj.timeFormat !== 'string') {
      isValid = false;
    }

    return isValid;
  }

  return false;
}
