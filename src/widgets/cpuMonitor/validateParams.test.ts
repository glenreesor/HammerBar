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
import type { ConfigParams } from './types';

const goodParamsGraph: ConfigParams = {
  type: 'graph',
  interval: 1,
  maxValues: 2,
};

const goodParamsText: ConfigParams = {
  type: 'text',
  interval: 1,
};

function expectPass(testParams: any) {
  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBe(testParams);
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

describe('type', () => {
  describe('invalid types', () => {
    const tests = [
      { description: 'fails when type is absent', type: undefined },
      { description: 'fails when type is a number', type: 1 },
      { description: 'fails when type is an array', type: ['bob'] },
      { description: 'fails when type is an object', type: {} },
      { description: 'fails when type is a function', type: () => 1 },
    ];

    test.each(tests)('$description', ({ type }) => {
      const testParams = {
        ...goodParamsGraph,
        type,
      };
      expectFail(testParams);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when type is a non-valid value', type: 'blarp' },
    ];

    test.each(tests)('$description', ({ type }) => {
      const testParams = {
        ...goodParamsGraph,
        type,
      };
      expectFail(testParams);
    });
  });
});

describe('interval', () => {
  describe('invalid types', () => {
    const tests = [
      { description: 'fails when interval is absent', interval: undefined },
      { description: 'fails when interval is a string', interval: '1' },
      { description: 'fails when interval is an array', interval: ['bob'] },
      { description: 'fails when interval is an object', interval: {} },
      { description: 'fails when interval is a function', interval: () => 1 },
    ];

    test.each(tests)('$description', ({ interval }) => {
      const testParams = {
        ...goodParamsGraph,
        interval,
      };
      expectFail(testParams);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when interval is negative', interval: -1 },
      { description: 'fails when interval is zero', interval: 0 },
    ];

    test.each(tests)('$description', ({ interval }) => {
      const testParams = {
        ...goodParamsGraph,
        interval,
      };
      expectFail(testParams);
    });
  });
});

describe('maxValues', () => {
  describe('invalid types', () => {
    const tests = [
      { description: 'fails when maxValues is absent', maxValues: undefined },
      { description: 'fails when maxValues is a string', maxValues: '1' },
      { description: 'fails when maxValues is an array', maxValues: ['bob'] },
      { description: 'fails when maxValues is an object', maxValues: {} },
      { description: 'fails when maxValues is a function', maxValues: () => 1 },
    ];

    test.each(tests)('$description', ({ maxValues }) => {
      const testParams = {
        ...goodParamsGraph,
        type: 'graph',
        maxValues,
      };
      expectFail(testParams);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when maxValues is negative', maxValues: -1 },
      { description: 'fails when maxValues is zero', maxValues: 0 },
    ];

    test.each(tests)('$description', ({ maxValues }) => {
      const testParams = {
        ...goodParamsGraph,
        maxValues,
      };
      expectFail(testParams);
    });
  });
});

test('passes when type is graph and interval and maxValues are correct', () => {
  const testParams = goodParamsGraph;
  expectPass(testParams);
});

test('passes when type is text and interval is correct', () => {
  const testParams = goodParamsText;
  expectPass(testParams);
});
