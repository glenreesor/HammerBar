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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/panel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import { getPanelButton } from './helpers/panelButton';

function isNonEmptyString(obj: unknown): obj is string {
  return typeof obj === 'string' && obj !== '';
}

export function getAppLauncherBuilder(
  unvalidatedBundleId: unknown,
): WidgetBuildingInfo {
  if (!isNonEmptyString(unvalidatedBundleId)) {
    return getNoopWidgetBuildingInfo('AppLauncher', [
      'bundleId must be a non-empty string',
    ]);
  }

  // This looks goofy because the type checking should suffice since it
  // correctly narrows the type of unvalidatedBundleId.
  //
  // However it appears that typescript doesn't maintain that knowledge
  // within the function below.
  const bundleId = unvalidatedBundleId;

  function getAppLauncherWidget({
    coords,
    height,
    panelColor,
    panelHoverColor,
  }: WidgetBuilderParams) {
    function cleanupPriorToDelete() {
      panelButton.cleanupPriorToDelete();
    }

    const panelButton = getPanelButton({
      coords,
      height,
      panelColor,
      panelHoverColor,
      imageInfo: { bundleId },
      onClick: () => hs.application.launchOrFocusByBundleID(bundleId),
    });

    return {
      bringToFront: () => panelButton.show(),
      cleanupPriorToDelete,
      hide: () => panelButton.hide(),
      show: () => panelButton.show(),
    };
  }

  return {
    buildErrors: [],
    name: 'AppLauncher',
    getWidth: (widgetHeight) => widgetHeight,
    getWidget: getAppLauncherWidget,
  };
}
