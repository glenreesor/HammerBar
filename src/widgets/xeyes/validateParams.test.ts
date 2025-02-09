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
import type { ConfigParams } from './types';
import { validateParams } from './validateParams';

const goodParams: ConfigParams = {
  minInterval: 1,
  maxInterval: 2,
};

describe('invalid params types', () => {
  const tests = [
    { description: 'fails when params is a number', testParams: 1 },
    { description: 'fails when params is an array', testParams: ['bob'] },
    { description: 'fails when params is an string', testParams: 'bob' },
  ];

  test.each(tests)('$description', ({ testParams }) => {
    const { isValid, validParams, expectedArgument } =
      validateParams(testParams);

    expect(isValid).toBe(false);
    expect(validParams).toBeUndefined();
    expect(expectedArgument?.length).toBeGreaterThan(0);
  });
});

describe('minInterval', () => {
  describe('invalid types', () => {
    const tests = [
      {
        description: 'fails when minInterval is absent',
        minInterval: undefined,
      },
      { description: 'fails when minInterval is a string', minInterval: '1' },
      {
        description: 'fails when minInterval is an array',
        minInterval: ['bob'],
      },
      { description: 'fails when minInterval is an object', minInterval: {} },
    ];

    test.each(tests)('$description', ({ minInterval }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        ...goodParams,
        minInterval,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when minInterval is negative', minInterval: -1 },
      { description: 'fails when minInterval is zero', minInterval: 0 },
    ];

    test.each(tests)('$description', ({ minInterval }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        ...goodParams,
        minInterval,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });
});

describe('maxInterval', () => {
  describe('invalid types', () => {
    const tests = [
      {
        description: 'fails when maxInterval is absent',
        maxInterval: undefined,
      },
      { description: 'fails when maxInterval is a string', maxInterval: '1' },
      {
        description: 'fails when maxInterval is an array',
        maxInterval: ['bob'],
      },
      { description: 'fails when maxInterval is an object', maxInterval: {} },
    ];

    test.each(tests)('$description', ({ maxInterval }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        ...goodParams,
        maxInterval,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when maxInterval is negative', maxInterval: -1 },
      { description: 'fails when maxInterval is zero', maxInterval: 0 },
    ];

    test.each(tests)('$description', ({ maxInterval }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        ...goodParams,
        maxInterval,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });
});

test('passes when minInterval and maxInterval are valid', () => {
  const { isValid, validParams, expectedArgument } = validateParams(goodParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBeDefined();
});
