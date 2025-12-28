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
import { validateConfig } from './validateConfig';
import type { WidgetConfig } from './types';

const goodConfig: WidgetConfig = {
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
  const { isValid, validConfig, expectedArgument } = validateConfig(testParams);

  expect(isValid).toBe(false);
  expect(validConfig).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
}

describe('showSeconds', () => {
  describe('invalid showSeconds types', () => {
    test('fails when showSeconds is a number', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodConfig, showSeconds: 1 });
    });

    test('fails when showSeconds is a string', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodConfig, showSeconds: '1' });
    });

    test('fails when showSeconds is an array', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodConfig, showSeconds: [] });
    });

    test('fails when showSeconds is a function', () => {
      expect(true).toBe(true); // Keep vitest happy -- at least one test present
      expectFail({ ...goodConfig, showSeconds: () => 'blarp' });
    });
  });

  test('fails when showSeconds is absent', () => {
    expect(true).toBe(true);
    expectFail({ ...goodConfig, showSeconds: undefined });
  });

  test('passes when showSeconds is a boolean', () => {
    const testParams = { ...goodConfig, showSeconds: true };

    const { isValid, validConfig, expectedArgument } =
      validateConfig(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBeUndefined();
    expect(validConfig).toStrictEqual(testParams);
  });
});

describe('showCirclePaths', () => {
  describe('invalid showCirclePaths types', () => {
    test('fails when showCirclePaths is a number', () => {
      expect(true).toBe(true);
      expectFail({ ...goodConfig, showCirclePaths: 1 });
    });

    test('fails when showCirclePaths is a string', () => {
      expect(true).toBe(true);
      expectFail({ ...goodConfig, showCirclePaths: '1' });
    });

    test('fails when showCirclePaths is an array', () => {
      expect(true).toBe(true);
      expectFail({ ...goodConfig, showCirclePaths: [] });
    });

    test('fails when showCirclePaths is a function', () => {
      expect(true).toBe(true);
      expectFail({ ...goodConfig, showCirclePaths: () => 'blarp' });
    });
  });

  test('fails when showCirclePaths is absent', () => {
    expect(true).toBe(true);
    expectFail({ ...goodConfig, showCirclePaths: undefined });
  });

  test('passes when showCirclePaths is a boolean', () => {
    const testParams = { ...goodConfig, showCirclePaths: true };

    const { isValid, validConfig, expectedArgument } =
      validateConfig(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBeUndefined();
    expect(validConfig).toStrictEqual(testParams);
  });
});
