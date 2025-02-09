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

function expectPass(testBundleId: string) {
  const { isValid, validBundleId, errorString } = validateParams(testBundleId);

  expect(isValid).toBe(true);
  expect(validBundleId).toBe(testBundleId);
  expect(errorString?.length).toBeUndefined;
}

function expectFail(testBundleId: any) {
  const { isValid, validBundleId, errorString } = validateParams(testBundleId);

  expect(isValid).toBe(false);
  expect(validBundleId).toBeUndefined();
  expect(errorString?.length).toBeGreaterThan(0);
}

describe('invalid bundleId types', () => {
  const tests = [
    { description: 'fails when bundleId is a number', bundleId: 1 },
    { description: 'fails when bundleId is an array', bundleId: ['bob'] },
    { description: 'fails when bundleId is an object', bundleId: {} },
    { description: 'fails when bundleId is a function', bundleId: () => 1 },
  ];

  test.each(tests)('$description', ({ bundleId }) => {
    expectFail(bundleId);
  });
});

describe('valid bundleId type', () => {
  test('fails when bundleId is an empty string', () => {
    const testBundleId = '';
    expectFail(testBundleId);
  });

  test('passes when bundleId is a non-empty string', () => {
    const testBundleId = 'bob';
    expectPass(testBundleId);
  });
});
