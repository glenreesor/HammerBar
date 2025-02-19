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

import { BLACK } from 'src/constants';

export function render(args: {
  canvas: hs.canvas.CanvasType;
  width: number;
  height: number;
}) {
  const { canvas, width, height } = args;

  const bgColor = { red: 1, green: 1, blue: 1 };
  const { formattedTime, formattedDate } = getFormattedCurrentDateTime();
  const fontSize = 12;
  const timeY = height / 2 - fontSize - fontSize / 2;
  const dateY = timeY + fontSize * 1.6;

  canvas.replaceElements([
    {
      type: 'rectangle',
      fillColor: bgColor,
      strokeColor: bgColor,
      frame: {
        x: 0,
        y: 0,
        w: width,
        h: height,
      },
    },
    {
      type: 'text',
      text: formattedTime,
      textAlignment: 'center',
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: 0,
        y: timeY,
        w: width,
        h: fontSize * 1.2,
      },
    },
    {
      type: 'text',
      text: formattedDate,
      textAlignment: 'center',
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: 0,
        y: dateY,
        w: width,
        h: fontSize * 1.2,
      },
    },
  ]);
}

function getFormattedCurrentDateTime(): {
  formattedTime: string;
  formattedDate: string;
} {
  const now = os.date('*t') as os.DateTable;

  const hour = now.hour < 13 ? now.hour : now.hour - 12;
  const minute = `${now.min < 10 ? '0' : ''}${now.min}`;
  const ampm = now.hour < 12 ? 'am' : 'pm';

  const year = now.year;
  const month = `${now.month < 10 ? '0' : ''}${now.month}`;
  const day = `${now.day < 10 ? '0' : ''}${now.day}`;

  return {
    formattedTime: `${hour}:${minute} ${ampm}`,
    formattedDate: `${year}-${month}-${day}`,
  };
}
