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
import { string } from './string';

describe('base validator', () => {
  describe('success', () => {
    test('it validates a string', () => {
      const testValue = 'my string';

      const schema = string();
      expect(schema.parse(testValue)).toBe(testValue);
    });
  });

  describe('throws', () => {
    test('when not a string', () => {
      const testValue = 42;

      const schema = string();
      expect(() => schema.parse(testValue)).toThrow();
    });
  });
});

describe('.nonEmpty()', () => {
  test('it validates a non-empty string', () => {
    const testValue = 'non-empty string';

    const schema = string().nonEmpty();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('throws for an empty string', () => {
    const testValue = '';

    const schema = string().nonEmpty();
    expect(() => schema.parse(testValue)).toThrow();
  });
});

describe('.optional()', () => {
  test('validates a string', () => {
    const testValue = 'hello';

    const schema = string().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = string().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });
});
