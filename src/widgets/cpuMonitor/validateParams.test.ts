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

import { expect, test } from 'vitest';

import { validateParams } from './validateParams';

test('fails when params is a number', () => {
  const testParams = 1;

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('fails when params is a string', () => {
  const testParams = 'bob';

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('fails when params is an array', () => {
  const testParams: unknown = [];

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('fails when params is an empty object', () => {
  const testParams = {};

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('fails when interval is missing', () => {
  const testParams = {
    maxValues: 5,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('fails when maxValues is missing', () => {
  const testParams = {
    interval: 5,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
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
