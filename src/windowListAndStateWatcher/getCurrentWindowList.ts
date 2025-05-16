// Copyright 2024, 2025 Glen Reesor
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

type WindowListCallback = (args: {
  windowListIsValid: boolean;
  windowList: hs.window.Window[];
}) => void;

let timer: hs.timer.Timer | undefined;
let reportWindowListCallback: WindowListCallback | undefined;
let screenWasLockedDuringWindowRetrieval = false;

export function getCurrentWindowList(callback: WindowListCallback) {
  if (timer === undefined) {
    screenWasLockedDuringWindowRetrieval = false;
    updateScreenLockedStatus();
    reportWindowListCallback = callback;
    orchestrateWindowListUpdating();
  }
}

function orchestrateWindowListUpdating() {
  // Getting all windows all at once (e.g. using hs.window.allWindows()) blocks
  // execution of other Hammerspoon code for too long.
  //
  // This block of other Hammerspoon code is long enough that some mouse events
  // (like mouseEnter into a window button or widget) get missed, thus resulting
  // in missed hover effects, making the UI look like it's stuttering.
  //
  // So instead use this approach:
  //  - get a list of all applications
  //  - release the execution thread long enough so mouse events don't get missed
  //  - get the list of windows for the first application
  //  - release the execution thread
  //  - repeat until all applications have been processed
  //
  // Releasing the execution thread for 0s is too short, and 0.1s makes the full
  // update process take too long. 0.01s seems to be a good compromise
  const allApplications = hs.application.runningApplications();
  if (allApplications.length !== 0) {
    timer = hs.timer.doAfter(0.01, () =>
      addNextAppsWindowsToList([], allApplications),
    );
  } else {
    reportWindowList([]);
  }
}

function addNextAppsWindowsToList(
  currentWindowList: hs.window.Window[],
  remainingApps: hs.application.Application[],
) {
  updateScreenLockedStatus();

  const thisApp = remainingApps[0];
  const allWindowsThisApp = thisApp.allWindows();

  // Not everything MacOS calls a "Window" should show up in the taskbar, so
  // filter out the things we don't want
  allWindowsThisApp.forEach((w) => {
    const excludeWindow =
      // Hammerspoon canvases (e.g. the taskbar, window buttons, etc)
      (thisApp.name() === 'Hammerspoon' &&
        w.title() !== 'Hammerspoon Console') ||
      //
      // Finder application (the parent application -- not an actual window)
      //   - Can't rely on w.isStandard() because that's false for a normal window that's minimized
      //   - Can't rely on w.role() === 'AXApplication' because that's never true
      //   for the Finder parent application
      (thisApp.name() === 'Finder' && w.subrole() === '') ||
      //
      // Application that's not an actual window. Just the parent application
      w.role() === 'AXApplication';

    if (!excludeWindow) {
      currentWindowList.push(w);
    }
  });

  remainingApps.splice(0, 1);
  if (remainingApps.length === 0) {
    reportWindowList(currentWindowList);
  } else {
    timer = hs.timer.doAfter(0.01, () =>
      addNextAppsWindowsToList(currentWindowList, remainingApps),
    );
  }
}

function reportWindowList(windowList: hs.window.Window[]) {
  updateScreenLockedStatus();
  const windowListIsValid = !screenWasLockedDuringWindowRetrieval;

  if (reportWindowListCallback !== undefined) {
    reportWindowListCallback({
      windowListIsValid,
      windowList,
    });
    timer = undefined;
  }
}

function updateScreenLockedStatus() {
  screenWasLockedDuringWindowRetrieval =
    screenWasLockedDuringWindowRetrieval ||
    hs.caffeinate.sessionProperties().CGSSessionScreenIsLocked === true;
}
