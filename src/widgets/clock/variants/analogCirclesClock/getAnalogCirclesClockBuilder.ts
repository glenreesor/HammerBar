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

import type { WidgetLayout, WidgetBuildingInfo } from 'src/mainPanel';
import { getNoopWidgetBuildingInfo } from 'src/util';
import { buildAnalogCirclesClockWidget } from './buildAnalogCirclesClockWidget';
import { validateConfig } from './validateConfig';

export function getAnalogCirclesClockBuilder(
  unvalidatedWidgetConfig: unknown,
): WidgetBuildingInfo {
  const { isValid, validConfig, expectedArgument } = validateConfig(
    unvalidatedWidgetConfig,
  );

  if (!isValid) {
    const errorDetails = [
      'Unexpected argument. Expecting an argument like this:',
      ...expectedArgument,
      'But instead this was received:',
      hs.inspect.inspect(unvalidatedWidgetConfig),
    ];

    return getNoopWidgetBuildingInfo('Analog Circles Clock', errorDetails);
  }

  return {
    type: 'success',
    widgetName: 'Clock',
    buildWidget: (widgetLayout: WidgetLayout) =>
      buildAnalogCirclesClockWidget(validConfig, widgetLayout),
  };
}
