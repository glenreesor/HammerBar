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
import { literal } from './literal';

describe('base validator', () => {
  describe('success', () => {
    test('it validates a string', () => {
      const testValue = 'my value';

      const schema = literal('my value');
      expect(schema.parse(testValue)).toBe(testValue);
    });

    test('it validates a number', () => {
      const testValue = 9;

      const schema = literal(9);
      expect(schema.parse(testValue)).toBe(testValue);
    });

    test('it validates null', () => {
      const testValue = null;

      const schema = literal(null);
      expect(schema.parse(testValue)).toBe(testValue);
    });

    test('it validates undefined', () => {
      const testValue = undefined;

      const schema = literal(undefined);
      expect(schema.parse(testValue)).toBe(testValue);
    });
  });

  describe('throws', () => {
    test('when not a string literal', () => {
      const testValue = 'my value';

      const schema = literal('required literal');
      expect(() => schema.parse(testValue)).toThrow();
    });

    test('when not a number literal', () => {
      const testValue = 9;

      const schema = literal(1);
      expect(() => schema.parse(testValue)).toThrow();
    });

    test('when not undefined', () => {
      const testValue = 9;

      const schema = literal(undefined);
      expect(() => schema.parse(testValue)).toThrow();
    });

    test('when not null', () => {
      const testValue = 9;

      const schema = literal(null);
      expect(() => schema.parse(testValue)).toThrow();
    });
  });
});

describe('.optional()', () => {
  test('validates a literal', () => {
    const testValue = 'hello';

    const schema = literal('hello').optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = literal('required literal').optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });
});
