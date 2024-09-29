// Copyright 2024 Glen Reesor
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
 * Return an object with all the relevant info that Hammerspoon provides about
 * the specified screen (monitor)
 */
export type ScreenInfoType = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function getScreenInfo(screen: hs.screen.ScreenType): ScreenInfoType {
  const id = screen.id();
  let name = screen.name();

  // VNC Server doesn't have a name
  if (name === null) {
    name = 'Unknown';
  }

  const frame = screen.frame();

  return {
    id,
    name,
    x: frame.x,
    y: frame.y,
    width: frame.w,
    height: frame.h,
  };
}
