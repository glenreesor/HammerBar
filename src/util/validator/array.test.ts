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
import { array } from './array';
import { string } from './string';

describe('base validator', () => {
  describe('success', () => {
    test('it validates an empty array', () => {
      const testValue = [];

      const schema = array(string());
      expect(schema.parse(testValue)).toStrictEqual(testValue);
    });

    test('it validates a single element array', () => {
      const testValue = ['test'];

      const schema = array(string());
      expect(schema.parse(testValue)).toStrictEqual(testValue);
    });
  });

  describe('throws', () => {
    test('when not an array', () => {
      const testValue = 9;

      const schema = array(string());
      expect(() => schema.parse(testValue)).toThrow();
    });

    test('when the element validator fails', () => {
      const testValue = [123];

      const schema = array(string());
      expect(() => schema.parse(testValue)).toThrow();
    });
  });
});

describe('.nonEmpty()', () => {
  test('it validates a non-empty array', () => {
    const testValue = ['test'];

    const schema = array(string()).nonEmpty();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });

  test('throws for an empty array', () => {
    const testValue = [];

    const schema = array(string()).nonEmpty();
    expect(() => schema.parse(testValue)).toThrow();
  });

  test('throws for undefined', () => {
    const testValue = undefined;

    const schema = array(string()).nonEmpty();
    expect(() => schema.parse(testValue)).toThrow();
  });
});

describe('.optional()', () => {
  test('validates an array', () => {
    const testValue = [];

    const schema = array(string()).optional();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = array(string()).optional();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });
});
