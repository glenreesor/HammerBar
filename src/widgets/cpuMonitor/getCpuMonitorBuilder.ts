// Copyright 2024, 2025 Glen Reesor
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
import { validateConfig } from './validateConfig';
import { buildCpuMonitorWidget } from './buildCpuMonitorWidget';

export function getCpuMonitorBuilder(
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

    return getNoopWidgetBuildingInfo('CpuMonitor', errorDetails);
  }

  return {
    type: 'success',
    widgetName: 'CpuMonitor',
    buildWidget: (widgetLayout: WidgetLayout) =>
      buildCpuMonitorWidget(validConfig, widgetLayout),
  };
}
