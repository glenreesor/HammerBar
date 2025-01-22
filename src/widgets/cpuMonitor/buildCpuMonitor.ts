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

import type { WidgetBuilderParams } from 'src/mainPanel';
import { getLineGraphBuilder } from '../lineGraph';
import type { ConfigParams } from './types';

export function buildCpuMonitor(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
) {
  return getLineGraphBuilder({
    title: 'CPU',
    interval: configParams.interval,
    maxValues: configParams.maxValues,
    maxGraphValue: configParams.maxGraphValue,
    cmd: getCpuUsage,
  }).buildWidget(builderParams);
}

function getCpuUsage() {
  const handle = io.popen('top -l 1');
  const output = handle.read('a');
  handle.close();

  // We're looking for a line of the form:
  //     CPU usage: x.x% user, x.x% sys
  //
  // Unfortunately tstl doesn't support TS regular expressions so this isn't
  // the prettiest :-(
  const cpuUsageString = 'CPU usage: ';
  const percentUserString = '% user, ';
  const lineStart = output.indexOf(cpuUsageString);

  const userValueStart = lineStart + cpuUsageString.length;
  const userValueEnd = output.indexOf(percentUserString, userValueStart);
  const userValue = output.substring(userValueStart, userValueEnd);

  const sysValueStart = userValueEnd + percentUserString.length;
  const sysValueEnd = output.indexOf('% sys', sysValueStart);
  const sysValue = output.substring(sysValueStart, sysValueEnd);

  const totalCpu = Number.parseFloat(userValue) + Number.parseFloat(sysValue);
  return totalCpu;
}
