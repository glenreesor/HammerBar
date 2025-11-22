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

function expectPass(testParams: any) {
  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toStrictEqual(testParams);
}

function expectFail(testParams: any) {
  const { isValid, validParams, expectedArgument } = validateParams(testParams);

  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
}

describe('invalid params types', () => {
  const tests = [
    { description: 'fails when params is a number', testParams: 1 },
    { description: 'fails when params is an array', testParams: ['bob'] },
    { description: 'fails when params is an string', testParams: 'bob' },
    { description: 'fails when params is a function', testParams: () => 1 },
  ];

  test.each(tests)('$description', ({ testParams }) => expectFail(testParams));
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
      {
        description: 'fails when minInterval is a function',
        minInterval: () => 1,
      },
    ];

    test.each(tests)('$description', ({ minInterval }) => {
      const testParams = {
        ...goodParams,
        minInterval,
      };
      expectFail(testParams);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when minInterval is negative', minInterval: -1 },
      { description: 'fails when minInterval is zero', minInterval: 0 },
    ];

    test.each(tests)('$description', ({ minInterval }) => {
      const testParams = {
        ...goodParams,
        minInterval,
      };
      expectFail(testParams);
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
      {
        description: 'fails when maxInterval is a function',
        maxInterval: () => 1,
      },
    ];

    test.each(tests)('$description', ({ maxInterval }) => {
      const testParams = {
        ...goodParams,
        maxInterval,
      };
      expectFail(testParams);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when maxInterval is negative', maxInterval: -1 },
      { description: 'fails when maxInterval is zero', maxInterval: 0 },
    ];

    test.each(tests)('$description', ({ maxInterval }) => {
      const testParams = {
        ...goodParams,
        maxInterval,
      };
      expectFail(testParams);
    });
  });
});

test('passes when minInterval and maxInterval are valid', () => {
  expectPass(goodParams);
});
