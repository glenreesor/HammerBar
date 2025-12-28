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
import type {
  WidgetBuildingInfo,
  WidgetBuildingInfoError,
  WidgetBuildingInfoSuccess,
} from '../mainPanel';

type ReturnType =
  | {
      isValid: true;
      validWidgetBuildingInfoArray: WidgetBuildingInfo[];
    }
  | {
      isValid: false;
      validWidgetBuildingInfoArray: undefined;
    };

const ConfigShapeSuccess = v.array(
  v.object({
    type: v.literal('success'),
    widgetName: v.string().nonEmpty(),
    buildWidget: v.fn(),
  }),
);

const ConfigShapeError = v.array(
  v.object({
    type: v.literal('error'),
    widgetName: v.string().nonEmpty(),
    widgetConfigErrors: v.array(v.string()),
  }),
);

export function validateWidgetBuildingInfoArray(
  unvalidated: unknown,
): ReturnType {
  try {
    const validatedConfig = ConfigShapeSuccess.parse(unvalidated);

    return {
      isValid: true,

      // Need an assertion because v.fn() only returns whether it's a function
      // but our type has extra info like parameters and return type
      validWidgetBuildingInfoArray:
        validatedConfig as WidgetBuildingInfoSuccess[],
    };
  } catch {
    try {
      const validatedConfig = ConfigShapeError.parse(unvalidated);

      return {
        isValid: true,

        // Need an assertion because v.fn() only returns whether it's a function
        // but our type has extra info like parameters and return type
        validWidgetBuildingInfoArray:
          validatedConfig as WidgetBuildingInfoError[],
      };
    } catch {
      return {
        isValid: false,
        validWidgetBuildingInfoArray: undefined,
      };
    }
  }
}
