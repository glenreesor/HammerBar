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
import { getFormattedDate, getFormattedTime } from './util';

const monthAbbrevs = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const dayAbbrevs = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

describe('getFormattedDate', () => {
  describe('year', () => {
    test('4 digit year', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-03-04');
    });

    test('2 digit year', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('25-03-04');
    });
  });

  describe('month', () => {
    test('numeric single digit', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-03-04');
    });

    test('numeric two digits', () => {
      const testData = {
        date: {
          year: 2025,
          month: 10,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-10-04');
    });

    test('abbreviation', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MMM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-Mar-04');
    });
  });

  describe('day', () => {
    test('numeric single digit', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-03-04');
    });

    test('numeric two digits', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 10,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-03-10');
    });

    test('abbreviation', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DDD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-03-Sun');
    });
  });

  describe('different separators', () => {
    test('-', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY-MM-DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025-03-04');
    });

    test('/', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY/MM/DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025/03/04');
    });

    test('.', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'YYYY.MM.DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe('2025.03.04');
    });
    test('freeform', () => {
      const testData = {
        date: {
          year: 2025,
          month: 3,
          day: 4,
          weekDayNum: 1,
        },
        dateFormat: 'Year is YYYY, month is MM, and day is DD',
        localeInfo: {
          monthAbbrevs,
          dayAbbrevs,
        },
      };

      expect(getFormattedDate(testData)).toBe(
        'Year is 2025, month is 03, and day is 04',
      );
    });
  });
});

describe('getFormattedTime', () => {
  describe('hour', () => {
    test('HH: <=10am', () => {
      const testData = {
        time: { hour: 9, minute: 30, second: 40 },
        timeFormat: 'HH:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('09:30:40');
    });

    test('HH: >=10am', () => {
      const testData = {
        time: { hour: 14, minute: 30, second: 40 },
        timeFormat: 'HH:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('14:30:40');
    });

    test('h: <=10am', () => {
      const testData = {
        time: { hour: 9, minute: 30, second: 40 },
        timeFormat: 'h:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('9:30:40');
    });

    test('h: >=10am', () => {
      const testData = {
        time: { hour: 14, minute: 30, second: 40 },
        timeFormat: 'h:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('2:30:40');
    });
  });

  describe('minute', () => {
    test('mm: <=9', () => {
      const testData = {
        time: { hour: 12, minute: 9, second: 40 },
        timeFormat: 'HH:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('12:09:40');
    });

    test('mm: >=10', () => {
      const testData = {
        time: { hour: 12, minute: 30, second: 40 },
        timeFormat: 'HH:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('12:30:40');
    });
  });

  describe('second', () => {
    test('ss: <=9', () => {
      const testData = {
        time: { hour: 12, minute: 10, second: 9 },
        timeFormat: 'HH:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('12:10:09');
    });

    test('ss: >=10', () => {
      const testData = {
        time: { hour: 12, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss',
      };

      expect(getFormattedTime(testData)).toBe('12:10:40');
    });
  });

  describe('ampm', () => {
    test('aa: am', () => {
      const testData = {
        time: { hour: 9, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss aa',
      };

      expect(getFormattedTime(testData)).toBe('09:10:40 a.m.');
    });

    test('aa: pm', () => {
      const testData = {
        time: { hour: 12, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss aa',
      };

      expect(getFormattedTime(testData)).toBe('12:10:40 p.m.');
    });

    test('a: am', () => {
      const testData = {
        time: { hour: 9, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss a',
      };

      expect(getFormattedTime(testData)).toBe('09:10:40 am');
    });

    test('a: pm', () => {
      const testData = {
        time: { hour: 12, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss a',
      };

      expect(getFormattedTime(testData)).toBe('12:10:40 pm');
    });

    test('A: am', () => {
      const testData = {
        time: { hour: 9, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss A',
      };

      expect(getFormattedTime(testData)).toBe('09:10:40 AM');
    });

    test('A: pm', () => {
      const testData = {
        time: { hour: 12, minute: 10, second: 40 },
        timeFormat: 'HH:mm:ss A',
      };

      expect(getFormattedTime(testData)).toBe('12:10:40 PM');
    });
  });
});
