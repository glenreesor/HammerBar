// Copyright 2021-2026 Glen Reesor
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

import { printIndentedTextBlock } from './util';
import type { WidgetBuildingInfo } from './mainPanel';
import { VERSION, BUILD_DATE, GIT_HASH } from './version';

import {
  addWidgetsPrimaryScreenLeft,
  addWidgetsPrimaryScreenRight,
  addWidgetsSecondaryScreenLeft,
  addWidgetsSecondaryScreenRight,
  setWindowListUpdateInterval,
  setWindowStateUpdateInterval,
  start,
  stop,
} from './main';

import {
  getAppLauncherBuilder,
  getAppMenuBuilder,
  getClockBuilder,
  getCpuMonitorBuilder,
  getLineGraphBuilder,
  getLineGraphCurrentValueBuilder,
  getTextBuilder,
  getXeyesBuilder,
} from './widgets';

import { getTheme } from 'src/theme';

import { validateWidgetBuildingInfoArray } from './init/validateWidgetBuildingInfo';

function validateAndAddWidgetsPrimaryScreenLeft(buildingInfo: unknown) {
  validateWidgetAndAdd(
    'addWidgetsPrimaryScreenLeft',
    addWidgetsPrimaryScreenLeft,
    buildingInfo,
  );
}

function validateAndAddWidgetsPrimaryScreenRight(buildingInfo: unknown) {
  validateWidgetAndAdd(
    'addWidgetsPrimaryScreenRight',
    addWidgetsPrimaryScreenRight,
    buildingInfo,
  );
}

function validateAndAddWidgetsSecondaryScreenLeft(buildingInfo: unknown) {
  validateWidgetAndAdd(
    'addWidgetsSecondaryScreenLeft',
    addWidgetsSecondaryScreenLeft,
    buildingInfo,
  );
}

function validateAndAddWidgetsSecondaryScreenRight(buildingInfo: unknown) {
  validateWidgetAndAdd(
    'addWidgetsSecondaryScreenRight',
    addWidgetsSecondaryScreenRight,
    buildingInfo,
  );
}

function validateWidgetAndAdd(
  functionName: string,
  adder: (widgetBuildingInfoArray: WidgetBuildingInfo[]) => void,
  buildingInfo: unknown,
) {
  const { isValid, validWidgetBuildingInfoArray } =
    validateWidgetBuildingInfoArray(buildingInfo);

  if (isValid) {
    adder(validWidgetBuildingInfoArray);
  } else {
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
      '      widgetName = "Widget Name",',
      '      widgetConfigErrors = {},',
      '    }',
      '  }',
    ];

    printIndentedTextBlock('error', 'Widget configuration error', [
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
}

function validateAndSetWindowListUpdateInterval(newInterval: unknown) {
  if (typeof newInterval !== 'number') {
    printIndentedTextBlock('error', 'Configuraiton error', [
      'Unexpected argument to setWindowListUpdateInterval',
      'Expected a number, but instead received this:',
      hs.inspect.inspect(newInterval),
    ]);
    return;
  }
  setWindowListUpdateInterval(newInterval);
}

function validateAndSetWindowStatusUpdateInterval(newInterval: unknown) {
  if (typeof newInterval !== 'number') {
    printIndentedTextBlock('error', 'Configuration error', [
      'Unexpected argument to setWindowStatusUpdateInterval',
      'Expected a number, but instead received this:',
      hs.inspect.inspect(newInterval),
    ]);
    return;
  }
  setWindowStateUpdateInterval(newInterval);
}

// Print version info here so it's the first the thing seen in the console
printIndentedTextBlock('info', 'HammerBar Version Info', [
  `Version   : ${VERSION}`,
  `Build Date: ${BUILD_DATE}`,
  `Git Hash  : ${GIT_HASH}`,
]);

// Users don't need to be burdened with understanding that they're getting a
// builder, so rename on export
export const widgets = {
  appLauncher: (unvalidatedWidgetConfig: unknown) =>
    getAppLauncherBuilder(unvalidatedWidgetConfig),

  appMenu: (unvalidatedWidgetConfig: unknown) =>
    getAppMenuBuilder(unvalidatedWidgetConfig, getTheme),

  clock: (unvalidatedWidgetConfig: unknown) =>
    getClockBuilder(unvalidatedWidgetConfig, getTheme),

  cpuMonitor: (unvalidatedWidgetConfig: unknown) =>
    getCpuMonitorBuilder(unvalidatedWidgetConfig, getTheme),

  lineGraph: (unvalidatedWidgetConfig: unknown) =>
    getLineGraphBuilder(unvalidatedWidgetConfig, getTheme),

  lineGraphCurrentValue: (unvalidatedWidgetConfig: unknown) =>
    getLineGraphCurrentValueBuilder(unvalidatedWidgetConfig, getTheme),

  text: (unvalidatedWidgetConfig: unknown) =>
    getTextBuilder(unvalidatedWidgetConfig, getTheme),

  xeyes: (unvalidatedWidgetConfig: unknown) =>
    getXeyesBuilder(unvalidatedWidgetConfig, getTheme),
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
