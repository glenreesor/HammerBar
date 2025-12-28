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
import { fn } from './function';

describe('base validator', () => {
  describe('success', () => {
    test('it validates a function', () => {
      const testValue = () => 'hello';

      const schema = fn();
      expect(schema.parse(testValue)).toBe(testValue);
    });
  });

  describe('throws', () => {
    test('when not a fn', () => {
      const testValue = 9;

      const schema = fn();
      expect(() => schema.parse(testValue)).toThrow();
    });
  });

  test('is reusable', () => {
    const testValue1 = () => 'hello';
    const testValue2 = 'not a function';
    const testValue3 = () => 'hello';

    const schema = fn();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(() => schema.parse(testValue2)).toThrow();
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
  });
});

describe('.optional()', () => {
  test('validates a function', () => {
    const testValue = () => 'hello';

    const schema = fn().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = fn().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('is reusable', () => {
    const testValue1 = undefined;
    const testValue2 = () => 'hello';
    const testValue3 = undefined;

    const schema = fn().optional();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(schema.parse(testValue2)).toStrictEqual(testValue2);
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
  });
});
