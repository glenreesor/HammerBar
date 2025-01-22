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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/mainPanel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import { validateParams } from './validateParams';
import { buildAppLauncherWidget } from './appLauncherBuilder';

export function getAppLauncherBuilder(
  unvalidatedBundleId: unknown,
): WidgetBuildingInfo {
  const { isValid, validBundleId, errorString } =
    validateParams(unvalidatedBundleId);
  if (!isValid) {
    return getNoopWidgetBuildingInfo('AppLauncher', [errorString]);
  }

  return {
    widgetName: 'AppLauncher',
    widgetParamErrors: [],
    getWidgetWidth: (widgetHeight) => widgetHeight,
    buildWidget: (widgetBuilderParams: WidgetBuilderParams) =>
      buildAppLauncherWidget(validBundleId, widgetBuilderParams),
  };
}
