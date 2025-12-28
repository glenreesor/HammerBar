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

import type { WidgetHandle, WidgetLayout } from 'src/mainPanel';
import { getLineGraphCurrentValueBuilder } from '../lineGraphCurrentValue';
import { getTextBuilder } from '../text';
import type { WidgetConfig } from './types';

export function buildCpuMonitorWidget(
  widgetConfig: WidgetConfig,
  widgetLayout: WidgetLayout,
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

  let widgetHandle: WidgetHandle;

  if (widgetConfig.type === 'text') {
    widgetHandle = getTextBuilder({
      title: 'CPU',
      interval: widgetConfig.interval,
      cmd: () => `${getHammerspoonProvidedCpuUsage()}%`,
    }).buildWidget(widgetLayout);
  } else {
    widgetHandle = getLineGraphCurrentValueBuilder({
      title: 'CPU',
      interval: widgetConfig.interval,
      maxValues: widgetConfig.maxValues,
      graphYMax: 100,
      cmd: getHammerspoonProvidedCpuUsage,
    }).buildWidget(widgetLayout);
  }

  return {
    ...widgetHandle,
    prepareForRemoval: () => {
      prepareForRemoval();
      widgetHandle.prepareForRemoval();
    },
  };
}
