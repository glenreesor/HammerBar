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
import { boolean } from './boolean';

describe('base validator', () => {
  describe('success', () => {
    test('it validates true', () => {
      const testValue = true;

      const schema = boolean();
      expect(schema.parse(testValue)).toBe(testValue);
    });

    test('it validates false', () => {
      const testValue = false;

      const schema = boolean();
      expect(schema.parse(testValue)).toBe(testValue);
    });
  });

  describe('throws', () => {
    test('when not a boolean', () => {
      const testValue = 9;

      const schema = boolean();
      expect(() => schema.parse(testValue)).toThrow();
    });
  });
});

describe('.optional()', () => {
  test('validates true', () => {
    const testValue = true;

    const schema = boolean().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('validates false', () => {
    const testValue = false;

    const schema = boolean().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = boolean().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });
});
