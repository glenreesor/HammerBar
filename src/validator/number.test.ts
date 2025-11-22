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
import { number } from './number';

describe('base validator', () => {
  describe('success', () => {
    test('it validates a number', () => {
      const testValue = 12;

      const schema = number();
      expect(schema.parse(testValue)).toBe(testValue);
    });
  });

  describe('throws', () => {
    test('when not a number', () => {
      const testValue = 'not a number';

      const schema = number();
      expect(() => schema.parse(testValue)).toThrow();
    });
  });
});

describe('.positive()', () => {
  test('it validates a positive number', () => {
    const testValue = 7;

    const schema = number().positive();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('throws for zero', () => {
    const testValue = 0;

    const schema = number().positive();
    expect(() => schema.parse(testValue)).toThrow();
  });

  test('throws for a negative number', () => {
    const testValue = -12;

    const schema = number().positive();
    expect(() => schema.parse(testValue)).toThrow();
  });
});

describe('.optional()', () => {
  test('validates a number', () => {
    const testValue = 7;

    const schema = number().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = number().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });
});
