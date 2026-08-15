// Copyright 2025, 2026 Glen Reesor
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

import type { WidgetBuildingInfo, WidgetLayout } from 'src/mainPanel';
import { getLineGraphCurrentValueBuilder } from 'src/widgets/lineGraphCurrentValue';
import { getTextBuilder } from '../text';
import type { WidgetConfig } from './types';
import type { Theme } from 'src/theme';

export function buildCpuMonitorWidget(
  widgetConfig: WidgetConfig,
  widgetLayout: WidgetLayout,
  getTheme: () => Theme,
) {
  // We don't want to block the thread each time `cmd` is called, so:
  // - update a local value using hammerspoon's native async cpuUsage function
  // - return that value each time `cmd` is called
  let cpuUsageFromHammerspoon = 0;
  let hammerspoonCpuUsageHandle:
    | ReturnType<typeof hs.host.cpuUsage>
    | undefined;

  function prepareForRemoval() {
    if (!hammerspoonCpuUsageHandle?.finished()) {
      hammerspoonCpuUsageHandle?.stop();
    }
    hammerspoonCpuUsageHandle = undefined;
  }

  function scheduleNextCpuUsageCallback() {
    hammerspoonCpuUsageHandle = hs.host.cpuUsage(
      widgetConfig.interval,
      updateLocalCpuUsage,
    );
  }

  function updateLocalCpuUsage(
    this: void,
    result: hs.host.CpuUsageReturnStats,
  ) {
    cpuUsageFromHammerspoon = Math.round(result.overall.active);
    scheduleNextCpuUsageCallback();
  }

  function getHammerspoonProvidedCpuUsage() {
    return cpuUsageFromHammerspoon;
  }

  scheduleNextCpuUsageCallback();

  let builder: WidgetBuildingInfo;

  if (widgetConfig.type === 'text') {
    builder = getTextBuilder(
      {
        title: 'CPU',
        interval: widgetConfig.interval,
        cmd: () => `${getHammerspoonProvidedCpuUsage()}%`,
      },
      getTheme,
    );
  } else {
    builder = getLineGraphCurrentValueBuilder(
      {
        title: 'CPU',
        interval: widgetConfig.interval,
        maxValues: widgetConfig.maxValues,
        graphYMax: 100,
        cmd: getHammerspoonProvidedCpuUsage,
      },
      getTheme,
    );
  }

  if (builder.type === 'error') {
    throw new Error('Unexpected builder error types');
  }

  const widgetHandle = builder.buildWidget(widgetLayout);

  return {
    ...widgetHandle,
    prepareForRemoval: () => {
      prepareForRemoval();
      widgetHandle.prepareForRemoval();
    },
  };
}
