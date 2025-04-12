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

const DEFAULT_UPDATE_INTERVAL = 3;
let updateInterval = DEFAULT_UPDATE_INTERVAL;

let windowListListeners: {
  screenId: number;
  callback: (windows: hs.window.WindowType[]) => void;
}[] = [];

let timer: hs.timer.TimerType | undefined;

export function setUpdateInterval(newInterval: number) {
  updateInterval = newInterval;
}

export function subscribeToWindowListUpdates(
  screenId: number,
  callback: (windows: hs.window.WindowType[]) => void,
) {
  windowListListeners.push({ screenId, callback });
  if (windowListListeners.length === 1) {
    start();
  }

  return () => unsubscribe(screenId);
}

function start() {
  if (!timer) {
    orchestrateWindowListUpdating();
  }
}

function stop() {
  if (timer) {
    timer.stop();
    timer = undefined;
  }
}

function unsubscribe(screenId: number) {
  windowListListeners = windowListListeners.filter(
    (l) => l.screenId !== screenId,
  );
  if (windowListListeners.length === 0) {
    stop();
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
    notifyListeners([]);
  }
}

function addNextAppsWindowsToList(
  currentWindowList: hs.window.WindowType[],
  remainingApps: hs.application.ApplicationType[],
) {
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
    notifyListeners(currentWindowList);
  } else {
    timer = hs.timer.doAfter(0.01, () =>
      addNextAppsWindowsToList(currentWindowList, remainingApps),
    );
  }
}

function notifyListeners(windowList: hs.window.WindowType[]) {
  windowListListeners.forEach((l) => {
    const windowsThisScreen = windowList.filter(
      (w) => w.screen().id() === l.screenId,
    );
    l.callback(windowsThisScreen);
  });

  timer = hs.timer.doAfter(updateInterval, orchestrateWindowListUpdating);
}
