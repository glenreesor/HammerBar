// Copyright 2023-2025 Glen Reesor
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

import { WidgetBuildingInfo } from 'src/mainPanel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import { getDefaultClockBuilder } from './variants/defaultClock/getDefaultClockBuilder';
import { getAnalogCirclesClockBuilder } from './variants/analogCirclesClock';
import { getAnalogClockBuilder } from './variants/analogClock';
import { getClockType } from './getClockType';

export function getClockBuilder(
  unvalidatedConfigParams: unknown,
): WidgetBuildingInfo {
  const { type, expectedArgument } = getClockType(unvalidatedConfigParams);

  if (type === 'unknown') {
    const errorDetails = [
      'Unexpected argument. Expecting an argument like this:',
      ...expectedArgument,
      'But instead this was received:',
      hs.inspect.inspect(unvalidatedConfigParams),
    ];

    return getNoopWidgetBuildingInfo('Clock', errorDetails);
  }

  if (type === 'default') {
    return getDefaultClockBuilder();
  }

  if (type === 'analog-clock') {
    return getAnalogClockBuilder(unvalidatedConfigParams);
  }

  return getAnalogCirclesClockBuilder(unvalidatedConfigParams);
}
