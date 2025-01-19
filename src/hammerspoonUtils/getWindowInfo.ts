// Copyright 2022, 2024 Glen Reesor
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

export type WindowInfoType = {
  appName: string;
  bundleId: string;
  id: number;
  isMinimized: boolean;
  isStandard: boolean;
  role: string;
  screenId: number;
  subrole: string;
  windowTitle: string;
};

/**
 * Return an object with all the relevant info that Hammerspoon provides about
 * the specified window
 */
export function getWindowInfo(window: hs.window.WindowType): WindowInfoType {
  const application = window.application();
  let appName;
  let bundleId;

  if (application === null) {
    // Not sure what these windows are
    appName = 'Unknown';
    bundleId = '';
  } else {
    appName = application.name();
    bundleId = application.bundleID();
  }

  return {
    appName: appName,
    bundleId: bundleId || '',
    id: window.id(),
    isMinimized: window.isMinimized(),
    isStandard: window.isStandard(),
    role: window.role(),
    screenId: window.screen().id(),
    subrole: window.subrole(),
    windowTitle: window.title(),
  };
}
