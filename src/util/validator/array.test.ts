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

  test('is reusable', () => {
    const testValue1 = [];
    const testValue2 = 'not an array';
    const testValue3 = [];

    const schema = array(string());

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(() => schema.parse(testValue2)).toThrow();
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
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

  test('is reusable', () => {
    const testValue1 = ['non empty 1'];
    const testValue2 = [];
    const testValue3 = ['non empty 2'];

    const schema = array(string()).nonEmpty();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(() => schema.parse(testValue2)).toThrow();
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
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

  test('is reusable', () => {
    const testValue1 = undefined;
    const testValue2 = [];
    const testValue3 = undefined;

    const schema = array(string()).optional();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(schema.parse(testValue2)).toStrictEqual(testValue2);
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
  });
});

describe('.optional() and .nonEmpty()', () => {
  test('validates a non-empty array', () => {
    const testValue = ['non empty'];

    const schema = array(string()).optional().nonEmpty();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });

  test('throws for an empty array', () => {
    const testValue = [];

    const schema = array(string()).optional().nonEmpty();
    expect(() => schema.parse(testValue)).toThrow();
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = array(string()).optional().nonEmpty();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });
});

describe('.nonEmpty() and .optional() (in that order)', () => {
  test('validates a non-empty array', () => {
    const testValue = ['non empty'];

    const schema = array(string()).nonEmpty().optional();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });

  test('throws for an empty array', () => {
    const testValue = [];

    const schema = array(string()).nonEmpty().optional();
    expect(() => schema.parse(testValue)).toThrow();
  });

  test('validates undefined', () => {
    const testValue = undefined;

    const schema = array(string()).nonEmpty().optional();
    expect(schema.parse(testValue)).toStrictEqual(testValue);
  });
});
