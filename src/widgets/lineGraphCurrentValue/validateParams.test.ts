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

const goodParams: ConfigParams = {
  title: 'title',
  interval: 1,
  maxValues: 2,
  graphYMax: 3,
  cmd: () => 1,
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

describe('title', () => {
  describe('invalid types', () => {
    const tests = [
      { description: 'fails when title is absent', title: undefined },
      { description: 'fails when title is a number', title: 1 },
      { description: 'fails when title is an array', title: ['bob'] },
      { description: 'fails when title is an object', title: {} },
      { description: 'fails when title is a function', title: () => 1 },
    ];

    test.each(tests)('$description', ({ title }) => {
      const testParams = {
        ...goodParams,
        title,
      };
      expectFail(testParams);
    });
  });
});

describe('cmd', () => {
  describe('invalid types', () => {
    const tests = [
      { description: 'fails when cmd is absent', title: undefined },
      { description: 'fails when cmd is a number', title: 1 },
      { description: 'fails when cmd is an array', title: ['bob'] },
      { description: 'fails when cmd is an object', title: {} },
      { description: 'fails when cmd is a function', title: () => 1 },
    ];

    test.each(tests)('$description', ({ title }) => {
      const testParams = {
        ...goodParams,
        title,
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
        ...goodParams,
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
        ...goodParams,
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
        ...goodParams,
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
        ...goodParams,
        maxValues,
      };
      expectFail(testParams);
    });
  });
});

describe('graphYMax', () => {
  describe('invalid types', () => {
    const tests = [
      {
        description: 'fails when graphYMax is a string',
        graphYMax: '1',
      },
      {
        description: 'fails when graphYMax is an array',
        graphYMax: ['bob'],
      },
      {
        description: 'fails when graphYMax is an object',
        graphYMax: {},
      },
      {
        description: 'fails when graphYMax is a function',
        graphYMax: () => 1,
      },
    ];

    test.each(tests)('$description', ({ graphYMax }) => {
      const testParams = {
        ...goodParams,
        graphYMax,
      };
      expectFail(testParams);
    });
  });

  describe('invalid values', () => {
    const tests = [
      {
        description: 'fails when graphYMax is negative',
        graphYMax: -1,
      },
      { description: 'fails when graphYMax is zero', graphYMax: 0 },
    ];

    test.each(tests)('$description', ({ graphYMax }) => {
      const testParams = {
        ...goodParams,
        graphYMax,
      };
      expectFail(testParams);
    });
  });
});

test('passes when interval and maxValues are correct', () => {
  const testParams = {
    ...goodParams,
    graphYMax: undefined,
  };
  expectPass(testParams);
});

test('passes when interval, maxValues and graphYMax are correct', () => {
  expectPass(goodParams);
});
