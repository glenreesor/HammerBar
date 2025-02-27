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

import type { Widget, WidgetBuilderParams } from 'src/mainPanel';
import { getLineGraphCurrentValueBuilder } from '../lineGraphCurrentValue';
import { getTextBuilder } from '../text';
import type { ConfigParams } from './types';

export function buildCpuMonitorWidget(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
) {
  // We don't want to block the thread each time `cmd` is called, so:
  // - update a local value using hammerspoon's native async cpuUsage function
  // - return that value each time `cmd` is called
  let cpuUsageFromHammerspoon = 0;
  let hammerspoonCpuUsageHandle:
    | ReturnType<typeof hs.host.cpuUsage>
    | undefined;

  function cleanupPriorToDelete() {
    if (!hammerspoonCpuUsageHandle?.finished()) {
      hammerspoonCpuUsageHandle?.stop();
    }
    hammerspoonCpuUsageHandle = undefined;
  }

  function scheduleNextCpuUsageCallback() {
    hammerspoonCpuUsageHandle = hs.host.cpuUsage(
      configParams.interval,
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

  let widget: Widget;

  if (configParams.type === 'text') {
    widget = getTextBuilder({
      title: 'CPU',
      interval: configParams.interval,
      cmd: () => `${getHammerspoonProvidedCpuUsage()}%`,
    }).buildWidget(builderParams);
  } else {
    widget = getLineGraphCurrentValueBuilder({
      title: 'CPU',
      interval: configParams.interval,
      maxValues: configParams.maxValues,
      graphYMax: 100,
      cmd: getHammerspoonProvidedCpuUsage,
    }).buildWidget(builderParams);
  }

  return {
    ...widget,
    cleanupPriorToDelete: () => {
      cleanupPriorToDelete();
      widget.cleanupPriorToDelete();
    },
  };
}
