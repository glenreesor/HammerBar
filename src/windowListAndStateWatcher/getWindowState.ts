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

import { printWindowInfo } from 'src/utils';
import type { WindowState } from './types';

const cachedAppIconByBundleId: Map<string, hs.image.Image> = new Map();
const cachedWindowSnapshotsById: Map<number, hs.image.Image> = new Map();

export function getWindowState(window: hs.window.Window): WindowState {
  potentiallyUpdateWindowSnapshotCache('getWindowState', window);

  return {
    id: window.id(),
    title: window.title(),
    isMinimized: window.isMinimized(),
    getAppIcon: () => getAppIcon(window),
    getSnapshot: () => getWindowSnapshot(window),
    onClick: () => handleWindowButtonClick(window),
  };
}

export function removeStaleCachedAppIcons(
  currentWindowList: hs.window.Window[],
) {
  const staleBundleIds: string[] = [];

  cachedAppIconByBundleId.forEach((_icon, cachedBundleId) => {
    const applicationStillExists = currentWindowList.some(
      (window) => window.application()?.bundleID() === cachedBundleId,
    );

    if (!applicationStillExists) {
      staleBundleIds.push(cachedBundleId);
    }
  });

  staleBundleIds.forEach((bundleId) => {
    cachedAppIconByBundleId.delete(bundleId);
  });
}

export function removeStaleCachedWindowSnapshots(
  currentWindowList: hs.window.Window[],
) {
  const staleWindowIds: number[] = [];

  cachedWindowSnapshotsById.forEach((_icon, cachedWindowId) => {
    const windowStillExists = currentWindowList.some(
      (window) => window.id() === cachedWindowId,
    );

    if (!windowStillExists) {
      staleWindowIds.push(cachedWindowId);
    }
  });

  staleWindowIds.forEach((windowId) => {
    cachedWindowSnapshotsById.delete(windowId);
  });
}

function getAppIcon(window: hs.window.Window): hs.image.Image {
  const bundleId = window.application()?.bundleID() || '';
  const cachedIcon = cachedAppIconByBundleId.get(bundleId);
  if (cachedIcon) {
    return cachedIcon;
  }

  const icon = hs.image.imageFromAppBundle(bundleId);
  cachedAppIconByBundleId.set(bundleId, icon);

  return icon;
}

function cacheCurrentWindowSnapshotIfValid(window: hs.window.Window) {
  // We know we're not going to get a valid snapshot:
  //   - if the screen is locked (MacOS returns undefined)
  //   - if the window is minimized (MacOS returns a 1x1 placeholder image)
  // So no point trying in those cases. There's probably also a performance
  // benefit to not trying
  const screenIsLocked =
    hs.caffeinate.sessionProperties().CGSSessionScreenIsLocked;
  if (!screenIsLocked && !window.isMinimized()) {
    const currentSnapshot = window.snapshot();

    // We've indirectly ruled out the invalid cases above but still need to keep
    // typescript happy
    if (currentSnapshot) {
      cachedWindowSnapshotsById.set(window.id(), currentSnapshot);
    }
  }
}

function getWindowSnapshot(window: hs.window.Window): hs.image.Image {
  cacheCurrentWindowSnapshotIfValid(window);
  // If we don't have a cached snapshot, the app's icon is better than nothing
  return cachedWindowSnapshotsById.get(window.id()) || getAppIcon(window);
}

function handleWindowButtonClick(window: hs.window.Window) {
  const w = window;
  const keyboardModifiers = hs.eventtap.checkKeyboardModifiers();

  if (keyboardModifiers.shift) {
    // User just wants to dump the window info without toggling window visibility
    printWindowInfo(w);
    return;
  }

  if (w.isMinimized()) {
    unminimizeWindow(w);
  } else {
    // If window is already completely visible minimize it, otherwise bring
    // it to the foreground
    const windowIdsFrontToBack = hs.window.orderedWindows().map((w) => w.id());

    if (!windowIdsFrontToBack.includes(w.id())) {
      // This is a special case corresponding to the Hammerspoon console.
      // Since it doesn't show up in the window list we don't know it's stacking
      // position so the only thing that makes sense is to minimize it
      minimizeWindow(w);
    } else {
      if (windowIdsFrontToBack[0] === w.id()) {
        minimizeWindow(w);
      } else {
        unminimizeWindow(w);
      }
    }
  }
}

function unminimizeWindow(window: hs.window.Window) {
  // Most apps require just focus(), but some like LibreOffice also require raise()
  window.raise();
  window.focus();
  potentiallyUpdateWindowSnapshotCache('unminimize', window);
}

function minimizeWindow(window: hs.window.Window) {
  potentiallyUpdateWindowSnapshotCache('minimize', window);
  window.minimize();
}

function potentiallyUpdateWindowSnapshotCache(
  action: 'minimize' | 'unminimize' | 'getWindowState',
  window: hs.window.Window,
) {
  // Dealing with window snapshots is tricky because:
  // - MacOS returns undefined if the screen is locked
  // - MacOS returns a placeholder 1x1 image if the window is minimized
  //
  // We can't guarantee snapshot reflects current window contents...
  //   Scenarios:
  //   - Unminimized:
  //     - Easy because MacOS returns a copy of the current contents
  //   - Minimized:
  //     - We need to rely on our cache
  //     - When should we update our cache?
  //       - regularly polling would work, but how often, and what will the performance
  //         impact be?
  //
  // Current implementation updates on the following events rather than polling,
  // which doesn't guarantee always up-to-date snapshot, but should be decent.
  //       (1) First time window is seen by HammerBar
  //       (2) Window is minimized by clicking HammerBar windowButton
  //       (3) Window is unminimized by clicking HammerBar windowButton
  //
  // User interaction scenarios:
  //  - Abbreviations:
  //      New      : New Window
  //      MinFrame : User minimizes window using the MacOS window frame button
  //      MinHB    : User minimizes window by clicking HammberBar button
  //      UnminDock: User unminimizes by using the dock icon
  //      UnminHB  : User unminimizes by clicking HammerBar button
  //      UnminHov : User hovers the HammerBar button when *unminimized*
  //
  // ---------------------------------------------------------------------------
  // User Actions                 Event    Cached Snapshot State Corresponds to
  //                              Handler
  // ---------------------------------------------------------------------------
  // New, MinFrame                (1)      Window on first appearance or last UnminHov
  // New, MinFrame, UnminDock     (1)      Window on first appearance or last UnminHov
  // New, MinFrame, UnminHB       (3)      Current state
  //
  // New, MinHB                   (2)      State immediately prior to minimize
  // New, MinHB   , UnminDock     (2)      State immediately prior to minimize
  // New, MinHB   , UnminHB       (3)      State immediately after unminimize
  //
  // So the cases where snapshot may be stale are:
  //   - New, MinFrame
  //   - New, MinFrame, UnminDock (but really, who's going to use the dock?)
  //   - New, MinHB   , UnminDock (ditto)

  if (action === 'minimize' || action === 'unminimize') {
    cacheCurrentWindowSnapshotIfValid(window);
  } else if (action === 'getWindowState') {
    // Only cache it if we've never seen this window before
    if (!cachedWindowSnapshotsById.has(window.id())) {
      cacheCurrentWindowSnapshotIfValid(window);
    }
  }
}
