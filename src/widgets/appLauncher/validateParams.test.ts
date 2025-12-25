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

import { expect, test } from 'vitest';
import { validateParams } from './validateParams';

// Will probably delete these. Put a placeholder in for now

test('it passes when bundleId is valid', () => {
  const testParams = {
    bundleId: 'my bundle id',
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toStrictEqual({
    ...testParams,
    args: undefined,
    hoverLabel: undefined,
  });
});

test('it passes when bundleId and args are valid', () => {
  const testParams = {
    bundleId: 'my bundle id',
    args: ['1', '2'],
    hoverLabel: undefined,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toStrictEqual(testParams);
});
