// Copyright 2021-2025 Glen Reesor
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

import type { WidgetBuildingInfo } from './mainPanel';
import { setWindowListWatcherUpdateInterval as applyWindowListWatcherUpdateInterval } from './windowButtonsPanel';

import {
  addWidgetsPrimaryScreenLeft,
  addWidgetsPrimaryScreenRight,
  addWidgetsSecondaryScreenLeft,
  addWidgetsSecondaryScreenRight,
  setWindowStatusUpdateInterval,
  start,
  stop,
} from './main';

import { printDiagnostic } from './utils';

import { getAppLauncherBuilder } from './widgets/appLauncher';
import { getAppMenuBuilder } from './widgets/appMenu';
import { getClockBuilder } from './widgets/clock';
import { getCpuMonitorBuilder } from './widgets/cpuMonitor';
import { getLineGraphBuilder } from './widgets/lineGraph';
import { getTextBuilder } from './widgets/text';
import { getXEyesBuilder } from './widgets/xeyes';

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
        isStringArray(curr.widgetParamErrors) &&
        typeof curr.widgetName === 'string' &&
        typeof curr.getWidgetWidth === 'function' &&
        typeof curr.buildWidget === 'function',
      true,
    )
  );
}

function printValidationError(functionName: string, buildingInfo: unknown) {
  const sampleAddWidgetsArgsUsingWidgets = [
    '  {',
    '    spoon.HammerBar.widgets:appMenu({',
    '        appList = {',
    '          { bundleId = "org.mozilla.firefox", label = "Firefox" },',
    '          { bundleId = "com.google.Chrome", label = "Chrome" },',
    '        },',
    '    }),',
    '    spoon.HammerBar.widgets:appLauncher("com.apple.finder"),',
    '  }',
  ];

  const sampleAddWidgetsArgsExact = [
    '  {',
    '    {',
    '      buildWidget = <function>',
    '      getWidgetWidth = <function>',
    '      widgetName = "Widget Name",',
    '      widgetParamErrors = {},',
    '    }',
    '  }',
  ];

  printDiagnostic([
    `Unexpected argument to ${functionName}`,
    'Expecting an argument like this:',
    ...sampleAddWidgetsArgsExact,
    '',
    `This would be the result of calling ${functionName} with widget generators like this:`,
    ...sampleAddWidgetsArgsUsingWidgets,
    '',
    'But instead this was received:',
    '',
    hs.inspect.inspect(buildingInfo),
  ]);
}

function validateAndAddWidgetsPrimaryScreenLeft(buildingInfo: unknown) {
  if (!isWidgetBuildingInfoArray(buildingInfo)) {
    printValidationError('addWidgetsPrimaryScreenLeft', buildingInfo);
    return;
  }

  addWidgetsPrimaryScreenLeft(buildingInfo);
}

function validateAndAddWidgetsPrimaryScreenRight(buildingInfo: unknown) {
  if (!isWidgetBuildingInfoArray(buildingInfo)) {
    printValidationError('addWidgetsPrimaryScreenRight', buildingInfo);
    return;
  }

  addWidgetsPrimaryScreenRight(buildingInfo);
}

function validateAndAddWidgetsSecondaryScreenLeft(buildingInfo: unknown) {
  if (!isWidgetBuildingInfoArray(buildingInfo)) {
    printValidationError('addWidgetsSecondaryScreenLeft', buildingInfo);
    return;
  }

  addWidgetsSecondaryScreenLeft(buildingInfo);
}

function validateAndAddWidgetsSecondaryScreenRight(buildingInfo: unknown) {
  if (!isWidgetBuildingInfoArray(buildingInfo)) {
    printValidationError('addWidgetsSecondaryScreenRight', buildingInfo);
    return;
  }

  addWidgetsSecondaryScreenRight(buildingInfo);
}

function validateAndSetWindowListUpdateInterval(newInterval: unknown) {
  if (typeof newInterval !== 'number') {
    printDiagnostic([
      'Unexpected argument to setWindowListUpdateInterval',
      'Expected a number, but instead received this:',
      hs.inspect.inspect(newInterval),
    ]);
    return;
  }
  applyWindowListWatcherUpdateInterval(newInterval);
}

function validateAndSetWindowStatusUpdateInterval(newInterval: unknown) {
  if (typeof newInterval !== 'number') {
    printDiagnostic([
      'Unexpected argument to setWindowStatusUpdateInterval',
      'Expected a number, but instead received this:',
      hs.inspect.inspect(newInterval),
    ]);
    return;
  }
  setWindowStatusUpdateInterval(newInterval);
}

// Users don't need to be burdened with understanding that they're getting a
// builder, so rename on export
export const widgets = {
  appLauncher: getAppLauncherBuilder,
  appMenu: getAppMenuBuilder,
  clock: getClockBuilder,
  cpuMonitor: getCpuMonitorBuilder,
  lineGraph: getLineGraphBuilder,
  text: getTextBuilder,
  xeyes: getXEyesBuilder,
};

export {
  start,
  stop,
  //
  validateAndAddWidgetsPrimaryScreenLeft as addWidgetsPrimaryScreenLeft,
  validateAndAddWidgetsPrimaryScreenRight as addWidgetsPrimaryScreenRight,
  //
  validateAndAddWidgetsSecondaryScreenLeft as addWidgetsSecondaryScreenLeft,
  validateAndAddWidgetsSecondaryScreenRight as addWidgetsSecondaryScreenRight,
  //
  validateAndSetWindowListUpdateInterval as setWindowListUpdateInterval,
  validateAndSetWindowStatusUpdateInterval as setWindowStatusUpdateInterval,
};
