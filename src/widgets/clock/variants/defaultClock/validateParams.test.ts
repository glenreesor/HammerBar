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

describe('success', () => {
  test('when params is undefined', () => {
    const { isValid, expectedArgument } = validateParams();
    expect(isValid).toBe(true);
    expect(expectedArgument).toBe(undefined);
  });

  test('when params.dateFormat is a string', () => {
    const testParams = { dateFormat: 'YY-MM-DD' };

    const { isValid, expectedArgument } = validateParams(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBe(undefined);
  });

  test('when params.timeFormat is a string', () => {
    const testParams = { timeFormat: 'h:mm:ss' };

    const { isValid, expectedArgument } = validateParams(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBe(undefined);
  });

  test('when params.dateFormat and params.timeFormat are strings', () => {
    const testParams = {
      dateFormat: 'YY-MM-DD',
      timeFormat: 'h:mm:ss',
    };

    const { isValid, expectedArgument } = validateParams(testParams);
    expect(isValid).toBe(true);
    expect(expectedArgument).toBe(undefined);
  });
});

describe('failure when params is an object and has invalid keys', () => {
  test('dateFormat is not a string', () => {
    const testParams = {
      dateFormat: 1,
    };

    const { isValid, expectedArgument } = validateParams(testParams);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });

  test('timeFormat is not a string', () => {
    const testParams = {
      timeFormat: 1,
    };

    const { isValid, expectedArgument } = validateParams(testParams);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });

  test('an extra key is present', () => {
    const testParams = {
      blarp: '1',
    };

    const { isValid, expectedArgument } = validateParams(testParams);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });
});

describe('failure when params is defined and not an object', () => {
  test('params is a number', () => {
    const { isValid, expectedArgument } = validateParams(1);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });

  test('params is a string', () => {
    const { isValid, expectedArgument } = validateParams('1');
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });

  test('params is a function', () => {
    const { isValid, expectedArgument } = validateParams(() => 1);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });

  test('params is an array', () => {
    const { isValid, expectedArgument } = validateParams([1]);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });

  test('params is a boolean', () => {
    const { isValid, expectedArgument } = validateParams(true);
    expect(isValid).toBe(false);
    expect(expectedArgument?.length).gt(0);
  });
});
