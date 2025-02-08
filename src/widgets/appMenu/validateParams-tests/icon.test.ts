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

test('passes when icon is missing', () => {
  const testParams = { appList: [goodAppEntry] };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);

  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBe(testParams);
});

describe('invalid icon type', () => {
  const tests = [
    { description: 'fails when icon is a number', icon: 1 },
    { description: 'fails when icon is an array', icon: ['bob'] },
    { description: 'fails when icon is a string', icon: '' },
  ];

  test.each(tests)('$description', ({ icon }) => {
    const { isValid, validParams, expectedArgument } = validateParams({
      appList: [goodAppEntry],
      icon,
    });

    expect(isValid).toBe(false);
    expect(validParams).toBeUndefined();
    expect(expectedArgument?.length).toBeGreaterThan(0);
  });
});

describe('invalid bundleId', () => {
  const tests = [
    { description: 'fails when bundleId is a number', bundleId: 1 },
    { description: 'fails when bundleId is an array', bundleId: ['bob'] },
    { description: 'fails when bundleId is an object', bundleId: {} },
  ];

  test.each(tests)('$description', ({ bundleId }) => {
    const { isValid, validParams, expectedArgument } = validateParams({
      appList: [goodAppEntry],
      icon: {
        bundleId,
        imagePath: undefined,
      },
    });

    expect(isValid).toBe(false);
    expect(validParams).toBeUndefined();
    expect(expectedArgument?.length).toBeGreaterThan(0);
  });
});

describe('invalid imagePath', () => {
  const tests = [
    { description: 'fails when imagePath is a number', imagePath: 1 },
    { description: 'fails when imagePath is an array', imagePath: ['bob'] },
    { description: 'fails when imagePath is an object', imagePath: {} },
  ];

  test.each(tests)('$description', ({ imagePath }) => {
    const { isValid, validParams, expectedArgument } = validateParams({
      appList: [goodAppEntry],
      icon: {
        bundleId: undefined,
        imagePath,
      },
    });

    expect(isValid).toBe(false);
    expect(validParams).toBeUndefined();
    expect(expectedArgument?.length).toBeGreaterThan(0);
  });
});

test('fails when bundleId and imagePath are both present', () => {
  const { isValid, validParams, expectedArgument } = validateParams({
    appList: [goodAppEntry],
    icon: {
      bundleId: 'bundleId',
      imagePath: 'imagePath',
    },
  });

  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});
