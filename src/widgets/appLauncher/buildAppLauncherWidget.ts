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

import type { WidgetLayout } from 'src/mainPanel';
import { getPanelButton } from '../_helpers/panelButton';
import type { WidgetConfig } from './types';

export function buildAppLauncherWidget(
  widgetConfig: WidgetConfig,
  widgetLayout: WidgetLayout,
) {
  const { bundleId } = widgetConfig;

  const args = widgetConfig.args ? `--args ${widgetConfig.args.join(' ')}` : '';

  const newInstance = widgetConfig.newInstance;

  const panelButton = getPanelButton({
    coords: widgetLayout.coords,
    widgetHeight: widgetLayout.widgetHeight,
    panelColor: widgetLayout.panelColor,
    panelHoverColor: widgetLayout.panelHoverColor,
    imageInfo: { bundleId },
    hoverLabel: widgetConfig.hoverLabel,
    onClick: () => {
      const optionalNewInstanceFlag = newInstance ? '-n' : '';
      const handle = io.popen(
        `open ${optionalNewInstanceFlag} -b ${bundleId} ${args}`,
      );
      handle.close();
    },
  });

  return panelButton;
}
