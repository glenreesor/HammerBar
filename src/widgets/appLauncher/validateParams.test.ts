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

import { validateParams } from './validateParams';

describe('invalid params types', () => {
  const tests = [
    { description: 'fails when params is a number', testParams: 1 },
    { description: 'fails when params is an array', testParams: ['bob'] },
    { description: 'fails when params is an object', testParams: {} },
  ];

  test.each(tests)('$description', ({ testParams }) => {
    const { isValid, validBundleId, errorString } = validateParams(testParams);

    expect(isValid).toBe(false);
    expect(validBundleId).toBeUndefined();
    expect(errorString?.length).toBeGreaterThan(0);
  });
});

describe('valid params type', () => {
  test('fails when params is an empty string', () => {
    const testParams = '';

    const { isValid, validBundleId, errorString } = validateParams(testParams);
    expect(isValid).toBe(false);
    expect(validBundleId).toBeUndefined();
    expect(errorString?.length).toBeGreaterThan(0);
  });

  test('passes when params is a non-empty string', () => {
    const testParams = 'bob';

    const { isValid, validBundleId, errorString } = validateParams(testParams);
    expect(isValid).toBe(true);
    expect(validBundleId).toBe('bob');
    expect(errorString?.length).toBeUndefined;
  });
});
