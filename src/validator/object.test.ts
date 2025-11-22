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
import { object } from './object';
import { string } from './string';

describe('base validator', () => {
  describe('success', () => {
    test('it validates an empty object', () => {
      const testValue = {};

      const schema = object({});
      expect(schema.parse(testValue)).toStrictEqual(testValue);
    });

    test('it validates a non-empty object', () => {
      const testValue = { myKey: 'hello' };

      const schema = object({
        myKey: string(),
      });
      expect(schema.parse(testValue)).toStrictEqual(testValue);
    });
  });

  describe('throws', () => {
    test('when not not an object', () => {
      const testValue = 9;

      const schema = object({
        myKey: string(),
      });
      expect(() => schema.parse(testValue)).toThrow();
    });

    test('when a field validator fails', () => {
      const testValue = {
        myKey: 'not a number',
      };

      const schema = object({
        myKey: number(),
      });

      expect(() => schema.parse(testValue)).toThrow();
    });

    test('when there are extra fields', () => {
      const testValue = {
        myKey: 'my string',
        extraKey: 'not expected',
      };

      const schema = object({
        myKey: string(),
      });

      expect(() => schema.parse(testValue)).toThrow();
    });
  });
});

describe('.optional()', () => {
  test('validates an object', () => {
    const testValue = {
      myKey: 'hello',
    };

    const schema = object({
      myKey: string(),
    }).optional();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = object({
      myKey: string(),
    }).optional();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });
});
