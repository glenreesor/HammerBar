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
  type: 'analog-circles-clock',
  showSeconds: true,
  showCirclePaths: true,
};

// The root clock validator has validated that we're getting an object
// like this:
//    {
//      type: 'analog-circles-clock',
//    }
// So we just have to validate other keys

function expectFail(testParams: any) {
  const { isValid, validParams, expectedArgument } = validateParams(testParams);

  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
}

describe('showSeconds', () => {
  describe('invalid showSeconds types', () => {
    test('fails when showSeconds is a number', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodParams, showSeconds: 1 });
    });

    test('fails when showSeconds is a string', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodParams, showSeconds: '1' });
    });

    test('fails when showSeconds is an array', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodParams, showSeconds: [] });
    });

    test('fails when showSeconds is a function', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodParams, showSeconds: () => 'blarp' });
    });
  });

  test('fails when showSeconds is absent', () => {
    expect(true).toBe(true);
    expectFail({ ...goodParams, showSeconds: undefined });
  });

  test('passes when showSeconds is a boolean', () => {
    const testParams = { ...goodParams, showSeconds: true };

    const { isValid, validParams, expectedArgument } =
      validateParams(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBeUndefined();
    expect(validParams).toStrictEqual(testParams);
  });
});

describe('showCirclePaths', () => {
  describe('invalid showCirclePaths types', () => {
    test('fails when showCirclePaths is a number', () => {
      expect(true).toBe(true);
      expectFail({ ...goodParams, showCirclePaths: 1 });
    });

    test('fails when showCirclePaths is a string', () => {
      expect(true).toBe(true);
      expectFail({ ...goodParams, showCirclePaths: '1' });
    });

    test('fails when showCirclePaths is an array', () => {
      expect(true).toBe(true);
      expectFail({ ...goodParams, showCirclePaths: [] });
    });

    test('fails when showCirclePaths is a function', () => {
      expect(true).toBe(true);
      expectFail({ ...goodParams, showCirclePaths: () => 'blarp' });
    });
  });

  test('fails when showCirclePaths is absent', () => {
    expect(true).toBe(true);
    expectFail({ ...goodParams, showCirclePaths: undefined });
  });

  test('passes when showCirclePaths is a boolean', () => {
    const testParams = { ...goodParams, showCirclePaths: true };

    const { isValid, validParams, expectedArgument } =
      validateParams(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBeUndefined();
    expect(validParams).toStrictEqual(testParams);
  });
});
