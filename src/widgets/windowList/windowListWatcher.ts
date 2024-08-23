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

const DEFAULT_UPDATE_INTERVAL = 3;
let updateInterval = DEFAULT_UPDATE_INTERVAL;

let windowListListeners: {
  screenId: number;
  callback: (windows: hs.WindowType[]) => void;
}[] = [];

let timer: hs.TimerType | undefined;

export function setUpdateInterval(newInterval: number) {
  updateInterval = newInterval;
}

export function subscribeToWindowListUpdates(
  screenId: number,
  callback: (windows: hs.WindowType[]) => void,
) {
  windowListListeners.push({ screenId, callback });
  if (windowListListeners.length === 1) {
    start();
  }

  return () => unsubscribe(screenId);
}

function start() {
  if (!timer) {
    getWindowListAndNotifyListeners();
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

function getWindowListAndNotifyListeners() {
  const allWindows = hs.window.allWindows();
  const regularWindows = allWindows.filter((w) => {
    const application = w.application();
    if (application === null) {
      return false;
    }

    return (
      w.role() === 'AXWindow' &&
      (application.name() !== 'Hammerspoon' ||
        w.title() === 'Hammerspoon Console')
    );
  });

  windowListListeners.forEach((l) => {
    const windowsThisScreen = regularWindows.filter(
      (w) => w.screen().id() === l.screenId,
    );
    l.callback(windowsThisScreen);
  });

  timer = hs.timer.doAfter(updateInterval, getWindowListAndNotifyListeners);
}
