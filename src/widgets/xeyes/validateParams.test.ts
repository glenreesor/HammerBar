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

test('fails when minInterval is missing', () => {
  const testParams = {
    maxInterval: 5,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('fails when maxInterval is missing', () => {
  const testParams = {
    minInterval: 5,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(false);
  expect(validParams).toBeUndefined();
  expect(expectedArgument?.length).toBeGreaterThan(0);
});

test('passes when all keys are correct', () => {
  const testParams = {
    minInterval: 5,
    maxInterval: 5,
  };

  const { isValid, validParams, expectedArgument } = validateParams(testParams);
  expect(isValid).toBe(true);
  expect(expectedArgument).toBeUndefined();
  expect(validParams).toBeDefined();
});
