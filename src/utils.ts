// Copyright 2022 Glen Reesor
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
 * Print the specifed text to the Hammerspoon console (one or multiple lines).
 *
 * If `text` is a single line, prefix it with `HammerBar: `
 * If `text` is multiple lines wrap those lines between:
 *  `HammerBar diagnostic start`
 *  `HammerBar diagnostic end`
 */
export function printDiagnostic(text: string | string[]) {
  if (typeof text === 'string') {
    print(`HammerBar: ${text}`);
  } else {
    print();
    print('HammerBar diagnostic start');
    text.forEach((line) => {
      print(`    ${line}`);
    });
    print('HammerBar diagnostic end');
    print();
  }
}
