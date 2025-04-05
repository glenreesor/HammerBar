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

/**
 * Return a string representation of the specified date using
 * the specified format string.
 *
 * @param date        An object representing the date to be formatted
 *                      year
 *                      month      (1-12)
 *                      day        (1-31)
 *                      weekdayNum (0 - 6 = Sun - Sat)
 *                                 Used if `DDD` placeholder has been specified
 *
 *                                 Yes it's odd that this is 0-based, especially
 *                                 given that lua is typically 1-based, but this
 *                                 matches lua's os.date('*t').wkday
 *
 * @param dateFormat A string like 'YYYY-MM-DD'. All placeholders specified
 *                   below will be replaced with the corresponding date values.
 *
 *                   For example:
 *                      'YYYY-MM-DD' --> '2025-03-10'
 *                      'YYYY.MM.DD' --> '2025.03.10'
 *
 *                   Valid placeholders are:
 *                      YYYY - 4 digit year
 *                      YY   - 2 digit  year
 *                      MMM  - Abbreviated short month name e.g. 'Mar'
 *                      MM   - 2 digit month number e.g. '03'
 *                      DDD  - Abbreviated short day name e.g. 'Mon'
 *                      DD   - 2 digit day number e.g. '10'
 *
 * @param localeInfo An object with the following keys:
 *                      monthAbbrevs - A zero-indexed array of month name
 *                                     abbreviations, starting with January
 *                      dayAbbrevs   - A zero-indexed array of day name
 *                                     abbreviations, starting with Sunday
 */
export function getFormattedDate(args: {
  date: {
    year: number;
    month: number;
    day: number;
    weekDayNum: number;
  };
  dateFormat: string;
  localeInfo: {
    monthAbbrevs: string[];
    dayAbbrevs: string[];
  };
}): string {
  const { date, dateFormat, localeInfo } = args;

  const yearString = date.year.toString();
  const monthNumString = date.month.toString().padStart(2, '0');
  const dayNumString = date.day.toString().padStart(2, '0');

  const zeroBasedMonth = date.month - 1;
  const zeroBasedWeekDay = date.weekDayNum - 1;
  const monthAbbrev = localeInfo.monthAbbrevs[zeroBasedMonth];
  const dayAbbrev = localeInfo.dayAbbrevs[zeroBasedWeekDay];

  const formattedDate = dateFormat
    .replace('YYYY', yearString)
    .replace('YY', yearString.slice(-2))
    .replace('MMM', monthAbbrev)
    .replace('MM', monthNumString)
    .replace('DDD', dayAbbrev)
    .replace('DD', dayNumString);

  return formattedDate;
}

/**
 * Format the specified time using the specified format string
 *
 * @param time       The time to be formatted
 *                      hour: 0 - 23
 *                      minute: 0 - 59
 *                      second: 0 - 61 (leap second, although nothing in this
 *                                     implementation relies on the difference between 59, 60, or 61)
 *
 * @param timeFormat A string like 'HH:mm:ss'. All placeholders specified
 *                   below will be replaced with the corresponding time values.
 *
 *                   For example for 1:29:39pm:
 *                      'h:mm:ss'  --> ' 1:29:39
 *                      'HH.mm.ss' --> '13.29.39'
 *
 *                   Valid placeholders are:
 *                      HH - 0-padded hour (00-23)
 *                      h  - hour (0-12)
 *                      mm - Minute (00-59)
 *                      ss - Second (00-61)
 *                      aa - 'a.m.' or 'p.m.' as appropriate
 *                      a  - 'am' or 'pm' as appropriate
 *                      A  - 'AM' or 'PM' as appropriate
 */
export function getFormattedTime(args: {
  time: {
    hour: number;
    minute: number;
    second: number;
  };
  timeFormat: string;
}): string {
  const { time, timeFormat } = args;

  const padded24Hour = time.hour.toString().padStart(2, '0');
  const hour12Format = (time.hour < 13 ? time.hour : time.hour - 12).toString();
  const paddedMinute = time.minute.toString().padStart(2, '0');
  const paddedSecond = time.second.toString().padStart(2, '0');

  const ampm =
    time.hour >= 12
      ? {
          aa: 'p.m.',
          a: 'pm',
          A: 'PM',
        }
      : {
          aa: 'a.m.',
          a: 'am',
          A: 'AM',
        };

  let formattedTime = timeFormat
    .replace('HH', padded24Hour)
    .replace('h', hour12Format)
    .replace('mm', paddedMinute)
    .replace('ss', paddedSecond);

  // am/pm replacement strings contain the *format* placeholders as substrings
  // so ensure we only match one placeholder
  if (timeFormat.includes('aa')) {
    formattedTime = formattedTime.replace('aa', ampm.aa);
  } else if (timeFormat.includes('a')) {
    formattedTime = formattedTime.replace('a', ampm.a);
  } else if (timeFormat.includes('A')) {
    formattedTime = formattedTime.replace('A', ampm.A);
  }

  return formattedTime;
}
