// Copyright 2024 Glen Reesor
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

import type { WidgetBuildingInfo } from 'src/panel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import { getLineGraphBuilder } from './lineGraph';

type ConfigParams = {
  interval: number;
  maxValues: number;
  maxGraphValue: number | undefined;
};

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    typeof (obj as ConfigParams).interval === 'number' &&
    typeof (obj as ConfigParams).maxValues === 'number' &&
    (typeof (obj as ConfigParams).maxGraphValue === 'number' ||
      typeof (obj as ConfigParams).maxGraphValue === 'undefined')
  );
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

export function getCpuMonitorBuilder(
  unvalidatedConfigParams: unknown,
): WidgetBuildingInfo {
  if (!isConfigParams(unvalidatedConfigParams)) {
    return getNoopWidgetBuildingInfo('CpuMonitor', [
      'Unexpected argument. Expecting an argument like this:',
      '',
      '  {',
      '    interval = <a number>,',
      '    maxValues: <a number>,',
      '    maxGraphValue: <a number or nil>,',
      '  }',
      '',
      'But instead this was received:',
      '',
      hs.inspect.inspect(unvalidatedConfigParams),
    ]);
  }

  // This looks goofy because the type checking should suffice since it
  // correctly narrows the type of unvalidatedConfigParams.
  //
  // However it appears that typescript doesn't maintain that knowledge
  // within the function below.
  const configParams = unvalidatedConfigParams;

  const getLineGraphWidget = getLineGraphBuilder({
    title: 'CPU',
    interval: configParams.interval,
    maxValues: configParams.maxValues,
    maxGraphValue: configParams.maxGraphValue,
    cmd: getCpuUsage,
  }).getWidget;

  return {
    buildErrors: [],
    name: 'CpuMonitor',
    getWidth: (widgetHeight) => widgetHeight * 1.5,
    getWidget: getLineGraphWidget,
  };
}
