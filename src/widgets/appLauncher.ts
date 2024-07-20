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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';
import { getPanelButton } from './helpers/panelButton';

export function getAppLauncherBuilder(bundleId: string): WidgetBuildingInfo {
  const buildErrors =
    bundleId === '' ? ['AppLauncher: bundleId must not be empty'] : [];

  function getAppLauncher({
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
    buildErrors,
    name: 'AppLauncher',
    getWidth: (widgetHeight) => widgetHeight,
    getWidget: getAppLauncher,
  };
}
