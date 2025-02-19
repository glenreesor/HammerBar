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
  test('fails when params is a number', () => {
    expect(true).toBe(true); // Keep vitest happy -- at least one test present
    expectFail(1);
  });

  test('fails when params is a string', () => {
    expect(true).toBe(true); // Keep vitest happy -- at least one test present
    expectFail('1');
  });

  test('fails when params is an array', () => {
    expect(true).toBe(true); // Keep vitest happy -- at least one test present
    expectFail([]);
  });

  test('fails when params is a function', () => {
    expect(true).toBe(true); // Keep vitest happy -- at least one test present
    expectFail(() => 'blarp');
  });

  test('fails when params is a boolean', () => {
    expect(true).toBe(true);
    expectFail(true);
  });
});

describe('invalid "type" type', () => {
  test('fails when type is absent', () => {
    expect(true).toBe(true);
    expectFail({});
  });

  test('fails when type is a number', () => {
    expect(true).toBe(true);
    expectFail({ type: 1 });
  });

  test('fails when type is an array', () => {
    expect(true).toBe(true);
    expectFail({ type: [] });
  });

  test('fails when type is a function', () => {
    expect(true).toBe(true);
    expectFail({ type: () => 'blarp' });
  });
});

test('fails when type is an incorrect value', () => {
  expect(true).toBe(true);
  expectFail({ type: 'blarp' });
});

test('valid params', () => {
  expect(true).toBe(true);
  expectPass(undefined);
  expectPass({ type: 'analog-circles-clock' });
});
