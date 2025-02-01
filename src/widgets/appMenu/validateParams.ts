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

import type { ConfigParams, IconInfo } from './types';

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
      '    { bundleId = "org.mozilla.firefox", label = "Firefox" },',
      '    { bundleId = "com.google.Chrome", label = "Chrome" },',
      '  }',
    ],
  };
}

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    isAppListArray((obj as ConfigParams).appList) &&
    (typeof (obj as ConfigParams).icon === 'undefined' ||
      isIconInfo((obj as ConfigParams).icon))
  );
}

function isIconInfo(obj: unknown): boolean {
  return (
    (typeof (obj as IconInfo).bundleId === 'string' &&
      typeof (obj as IconInfo).imagePath === 'undefined') ||
    (typeof (obj as IconInfo).bundleId === 'undefined' &&
      typeof (obj as IconInfo).imagePath === 'string')
  );
}

function isAppListArray(obj: unknown): boolean {
  return (
    Array.isArray(obj) &&
    obj.reduce(
      (accum, curr) =>
        accum &&
        typeof curr.bundleId === 'string' &&
        typeof curr.label === 'string',
      true,
    )
  );
}
