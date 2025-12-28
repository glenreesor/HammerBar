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

import { validator as v } from 'src/util';

const commonShape = {
  appList: v
    .array(
      v.object({
        bundleId: v.string(),
        label: v.string(),
        args: v.array(v.string()).optional(),
        newInstance: v.boolean().optional(),
      }),
    )
    .nonEmpty(),
  hoverLabel: v.string().optional(),
};

export const configValidator1 = v.object({
  ...commonShape,
  icon: v
    .object({
      bundleId: v.string(),
      imagePath: v.literal(undefined).optional(),
    })
    .optional(),
});

export const configValidator2 = v.object({
  ...commonShape,
  icon: v
    .object({
      bundleId: v.literal(undefined).optional(),
      imagePath: v.string(),
    })
    .optional(),
});
export type WidgetConfig =
  | ReturnType<typeof configValidator1.parse>
  | ReturnType<typeof configValidator2.parse>;
