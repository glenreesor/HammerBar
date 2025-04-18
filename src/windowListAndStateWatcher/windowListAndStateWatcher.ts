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

import type { WindowState } from './types';
import { getCurrentWindowList } from './getCurrentWindowList';
import { getWindowState } from './getWindowState';

const DEFAULT_WINDOW_LIST_UPDATE_INTERVAL = 3;
const DEFAULT_WINDOW_STATE_UPDATE_INTERVAL = 2;

let windowListUpdateInterval = DEFAULT_WINDOW_LIST_UPDATE_INTERVAL;
let windowStateUpdateInterval = DEFAULT_WINDOW_STATE_UPDATE_INTERVAL;

let windowListListeners: {
  screenId: number;
  callback: (windowStates: WindowState[]) => void;
}[] = [];

let windowListTimer: hs.timer.TimerType | undefined;
let windowStateUpdateTimer: hs.timer.TimerType | undefined;

let currentWindowList: hs.window.WindowType[] = [];

export function setWindowListUpdateInterval(newInterval: number) {
  windowListUpdateInterval = newInterval;
}

export function setWindowStateUpdateInterval(newInterval: number) {
  windowStateUpdateInterval = newInterval;
}

export function subscribeToWindowListUpdates(
  screenId: number,
  callback: (windowStates: WindowState[]) => void,
) {
  windowListListeners.push({ screenId, callback });
  if (windowListListeners.length === 1) {
    start();
  }

  return () => unsubscribe(screenId);
}

function start() {
  if (!windowListTimer) {
    getCurrentWindowList(saveCurrentWindowList);
  }

  if (!windowStateUpdateTimer) {
    updateWindowStates();
  }
}

function stop() {
  if (windowListTimer) {
    windowListTimer.stop();
    windowListTimer = undefined;
  }

  if (windowStateUpdateTimer) {
    windowStateUpdateTimer.stop();
    windowStateUpdateTimer = undefined;
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

function saveCurrentWindowList(windowList: hs.window.WindowType[]) {
  const listIsEmpty =
    windowList.length === 0 ||
    windowList[0].application()?.name() === 'loginwindow';

  // Don't send useless window lists to listeners because when the screen
  // is unlocked, the panels will show no window buttons until the next update
  if (!listIsEmpty) {
    currentWindowList = windowList;
    notifyListeners();
  }

  windowListTimer = hs.timer.doAfter(windowListUpdateInterval, () =>
    getCurrentWindowList(saveCurrentWindowList),
  );
}

function updateWindowStates() {
  notifyListeners();
  windowStateUpdateTimer = hs.timer.doAfter(
    windowStateUpdateInterval,
    updateWindowStates,
  );
}

function notifyListeners() {
  windowListListeners.forEach((l) => {
    const windowsThisScreen = currentWindowList.filter(
      (w) => w.screen().id() === l.screenId,
    );
    l.callback(windowsThisScreen.map((w) => getWindowState(w)));
  });
}
