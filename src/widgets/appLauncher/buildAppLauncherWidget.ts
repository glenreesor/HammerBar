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
import { getPanelButton } from '../_helpers/panelButton';

export function buildAppLauncherWidget(
  bundleId: string,
  builderParams: WidgetBuilderParams,
) {
  // Eventually expose this as user config
  const alwaysCreateNewWindow = true;

  const panelButton = getPanelButton({
    coords: builderParams.coords,
    widgetHeight: builderParams.widgetHeight,
    panelColor: builderParams.panelColor,
    panelHoverColor: builderParams.panelHoverColor,
    imageInfo: { bundleId },
    onClick: () => {
      const optionalNewWindowFlag = alwaysCreateNewWindow ? '-n' : '';
      const handle = io.popen(`open ${optionalNewWindowFlag} -b ${bundleId}`);
      handle.close();
    },
  });

  return panelButton;
}
