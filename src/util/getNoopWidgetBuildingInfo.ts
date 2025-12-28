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

import { WidgetBuildingInfo } from 'src/mainPanel';

export function getNoopWidgetBuildingInfo(
  widgetName: string,
  widgetConfigErrors: string[],
): WidgetBuildingInfo {
  return {
    widgetName,
    widgetConfigErrors,
    buildWidget: () => ({
      width: 0,
      bringToFront: () => undefined,
      prepareForRemoval: () => undefined,
      hide: () => undefined,
      show: () => undefined,
    }),
  };
}
