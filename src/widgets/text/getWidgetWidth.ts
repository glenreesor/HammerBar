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

// We need this as a separate function so HammerBar can query it *before*
// the widget is built (for layout purposes)
//
// Ideally this would live in textWidgetBuilder.ts but tstl creates code
// that results in a stack overflow :-(
export function getWidgetWidth(widgetHeight: number) {
  return widgetHeight * 1.5;
}
