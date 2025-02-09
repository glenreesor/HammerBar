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

describe('interval', () => {
  describe('invalid types', () => {
    const tests = [
      { description: 'fails when interval is absent', interval: undefined },
      { description: 'fails when interval is a string', interval: '1' },
      { description: 'fails when interval is an array', interval: ['bob'] },
      { description: 'fails when interval is an object', interval: {} },
    ];

    test.each(tests)('$description', ({ interval }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        interval,
        maxValues: 1,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when interval is negative', interval: -1 },
      { description: 'fails when interval is zero', interval: 0 },
    ];

    test.each(tests)('$description', ({ interval }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        interval,
        maxValues: 1,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
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
    ];

    test.each(tests)('$description', ({ maxValues }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        interval: 1,
        maxValues,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });

  describe('invalid values', () => {
    const tests = [
      { description: 'fails when maxValues is negative', maxValues: -1 },
      { description: 'fails when maxValues is zero', maxValues: 0 },
    ];

    test.each(tests)('$description', ({ maxValues }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        interval: 1,
        maxValues,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });
});

describe('maxGraphValue', () => {
  describe('invalid types', () => {
    const tests = [
      {
        description: 'fails when maxGraphValue is a string',
        maxGraphValue: '1',
      },
      {
        description: 'fails when maxGraphValue is an array',
        maxGraphValue: ['bob'],
      },
      {
        description: 'fails when maxGraphValue is an object',
        maxGraphValue: {},
      },
    ];

    test.each(tests)('$description', ({ maxGraphValue }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        interval: 1,
        maxValues: 1,
        maxGraphValue,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });

  describe('invalid values', () => {
    const tests = [
      {
        description: 'fails when maxGraphValue is negative',
        maxGraphValue: -1,
      },
      { description: 'fails when maxGraphValue is zero', maxGraphValue: 0 },
    ];

    test.each(tests)('$description', ({ maxGraphValue }) => {
      const { isValid, validParams, expectedArgument } = validateParams({
        interval: 1,
        maxValues: 1,
        maxGraphValue,
      });

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    });
  });
});

test('passes when interval and maxValues are correct', () => {
  const testParams = {
    interval: 5,
    maxValues: 6,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBeDefined();
});

test('passes when interval, maxValues and maxGraphValue are correct', () => {
  const testParams = {
    interval: 5,
    maxValues: 6,
    maxGraphValue: 100,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBeDefined();
});
