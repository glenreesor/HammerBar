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

import { describe, expect, test } from 'vitest';
import { validateParams } from '../validateParams';

const goodAppEntry = { bundleId: 'bundle ID', label: 'my label' };

describe('invalid params types', () => {
  const tests = [
    { description: 'fails when params is a number', testParams: 1 },
    { description: 'fails when params is an array', testParams: ['bob'] },
    { description: 'fails when params is a string', testParams: '' },
  ];

  test.each(tests)('$description', ({ testParams }) => {
    const { isValid, validParams, expectedArgument } =
      validateParams(testParams);

    expect(isValid).toBe(false);
    expect(validParams).toBeUndefined();
    expect(expectedArgument?.length).toBeGreaterThan(0);
  });
});

test('passes when appList correct and icon missing', () => {
  const testParams = {
    appList: [{ bundleId: 'bundleId', label: 'myLabel' }],
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBeDefined();
});

test('passes when appList and icon correct', () => {
  const testParams = {
    appList: [{ bundleId: 'bundleId', label: 'myLabel' }],
    icon: {
      bundleId: 'bundleId',
    },
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBeDefined();
});
