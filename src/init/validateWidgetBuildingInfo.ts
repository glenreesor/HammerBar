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

import type { WidgetBuildingInfo } from '../mainPanel';

type ReturnType =
  | {
      isValid: true;
      validWidgetBuildingInfoArray: WidgetBuildingInfo[];
    }
  | {
      isValid: false;
      validWidgetBuildingInfoArray: undefined;
    };

export function validateWidgetBuildingInfoArray(
  unvalidated: unknown,
): ReturnType {
  if (isWidgetBuildingInfoArray(unvalidated)) {
    return {
      isValid: true,
      validWidgetBuildingInfoArray: unvalidated,
    };
  }

  return {
    isValid: false,
    validWidgetBuildingInfoArray: undefined,
  };
}

function isStringArray(obj: unknown): obj is string[] {
  return (
    Array.isArray(obj) &&
    obj.reduce((accum, curr) => accum && typeof curr === 'string', true)
  );
}

function isWidgetBuildingInfoArray(obj: unknown): obj is WidgetBuildingInfo[] {
  return (
    Array.isArray(obj) &&
    obj.reduce(
      (accum, curr) =>
        accum &&
        isStringArray(curr.widgetConfigErrors) &&
        typeof curr.widgetName === 'string' &&
        typeof curr.buildWidget === 'function',
      true,
    )
  );
}
