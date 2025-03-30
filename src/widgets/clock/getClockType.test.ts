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
import { getClockType } from './getClockType';

// The goal of this file is just to test that the proper type is
// returned. Since the logic is based on the validators for the individual
// clock variants, we don't have to test all combinations of valid
// parameters (those are tested in each variant's own test suite).

test('default clock', () => {
  expect(getClockType().type).toBe('default');
});

test('analog-clock', () => {
  const testParams = {
    type: 'analog-clock',
    showSeconds: true,
  };
  expect(getClockType(testParams).type).toBe('analog-clock');
});

test('analog-circles-clock', () => {
  const testParams = {
    type: 'analog-circles-clock',
    showSeconds: true,
    showCirclePaths: true,
  };
  expect(getClockType(testParams).type).toBe('analog-circles-clock');
});

test('unknown type', () => {
  const testParams = { type: 'blarp' };
  const result = getClockType(testParams);

  expect(result.type).toBe('unknown');
  expect(result.expectedArgument).length.gt(0);
});
