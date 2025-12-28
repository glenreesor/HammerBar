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

  test('is reusable', () => {
    const testValue1 = 7;
    const testValue2 = 'not an boolean';
    const testValue3 = 7;

    const schema = number();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(() => schema.parse(testValue2)).toThrow();
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
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

  test('is reusable', () => {
    const testValue1 = 7;
    const testValue2 = -42;
    const testValue3 = 7;

    const schema = number().positive();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(() => schema.parse(testValue2)).toThrow();
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
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

  test('is reusable', () => {
    const testValue1 = undefined;
    const testValue2 = 7;
    const testValue3 = undefined;

    const schema = number().optional();

    expect(schema.parse(testValue1)).toStrictEqual(testValue1);
    expect(schema.parse(testValue2)).toStrictEqual(testValue2);
    expect(schema.parse(testValue3)).toStrictEqual(testValue3);
  });
});

describe('.optional() and .positive()', () => {
  test('it validates undefined', () => {
    const testValue = undefined;

    const schema = number().optional().positive();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('it validates a positive number', () => {
    const testValue = 7;

    const schema = number().optional().positive();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('throws for zero', () => {
    const testValue = 0;

    const schema = number().optional().positive();
    expect(() => schema.parse(testValue)).toThrow();
  });

  test('throws for a negative number', () => {
    const testValue = -12;

    const schema = number().optional().positive();
    expect(() => schema.parse(testValue)).toThrow();
  });
});

describe('.positive() and .optional() (that order)', () => {
  test('it validates undefined', () => {
    const testValue = undefined;

    const schema = number().positive().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('it validates a positive number', () => {
    const testValue = 7;

    const schema = number().positive().optional();
    expect(schema.parse(testValue)).toBe(testValue);
  });

  test('throws for zero', () => {
    const testValue = 0;

    const schema = number().positive().optional();
    expect(() => schema.parse(testValue)).toThrow();
  });

  test('throws for a negative number', () => {
    const testValue = -12;

    const schema = number().positive().optional();
    expect(() => schema.parse(testValue)).toThrow();
  });
});
