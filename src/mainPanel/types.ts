// Copyright 2023-2025 Glen Reesor
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

export type WidgetBuilderGetter = (
  unvalidatedWidgetParams: unknown,
) => WidgetBuildingInfo;

export type WidgetBuildingInfo = {
  widgetName: string;
  widgetParamErrors: string[];
  getWidgetWidth: (widgetHeight: number) => number;
  buildWidget: (params: WidgetBuilderParams) => Widget;
};

export type WidgetBuilderParams = {
  coords: { x: number; y: number };
  widgetHeight: number;
  panelColor: hs.canvas.ColorType;
  panelHoverColor: hs.canvas.ColorType;
};

export type Widget = {
  bringToFront: () => void;
  cleanupPriorToDelete: () => void;
  hide: () => void;
  show: () => void;
};
