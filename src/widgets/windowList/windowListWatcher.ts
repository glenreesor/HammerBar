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

import { getWindowInfo } from 'src/hammerspoonUtils';
import type { WindowInfoType } from 'src/hammerspoonUtils';

let windowListListeners: { screenId: number, callback: (windows: WindowInfoType[]) => void}[] = [];
let timer: hs.TimerType | undefined;

export function listenToWindows(screenId: number, callback: (windows: WindowInfoType[]) => void) {
  windowListListeners.push({ screenId, callback });
  if (windowListListeners.length === 1) {
    start();
  }

  return () => unsubscribe(screenId);
}

function start() {
  if (!timer) {
    getWindowList()
  }
}

function stop() {
  if (timer) {
    timer.stop();
    timer = undefined;
  }
}

function unsubscribe(screenId: number) {
  windowListListeners = windowListListeners.filter((l) => l.screenId !== screenId);
  if (windowListListeners.length === 0) {
    stop();
  }
}

function getWindowList() {
  print('Retrieving window list');
  const allWindows = hs.window.allWindows().map((hsWindow) => getWindowInfo(hsWindow));
  const currentRegularWindows = allWindows.filter(
    (w) => (
      w.role === 'AXWindow' &&
      (w.appName !== 'Hammerspoon' || w.windowTitle === 'Hammerspoon Console')
    )
  );

  print('    Calling callbacks');
  windowListListeners.forEach((l) =>{
    const windows = currentRegularWindows.filter((w) => w.screenId === l.screenId);
    print(`    screen ${l.screenId}`);
    l.callback(windows);
  });

  print('    done');
  timer = hs.timer.doAfter(3, getWindowList);
}
