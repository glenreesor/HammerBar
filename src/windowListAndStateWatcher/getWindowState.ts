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

const cachedAppIconByBundleId: Map<string, hs.image.ImageType> = new Map();
const cachedWindowSnapshotsById: Map<number, hs.image.ImageType> = new Map();

export function getWindowState(window: hs.window.WindowType): WindowState {
  // Ensure app icon and window snapshots are cached, in particular snapshot,
  // since otherwise it only gets updated when user clicks the windowButton.
  // But if they minimized using the window toolbar button, we won't have a
  // snapshot to show.
  getAppIcon(window);
  getWindowSnapshot(window);

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
  currentWindowList: hs.window.WindowType[],
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
  currentWindowList: hs.window.WindowType[],
) {
  const staleWindowIds: number[] = [];

  cachedWindowSnapshotsById.forEach((_icon, cachedWindowId) => {
    const windowStillExists = currentWindowList.some(
      (window) => window.id() === cachedWindowId,
    );

    if (!windowStillExists) {
      staleWindowIds.push(cachedWindowId);
    }

    staleWindowIds.forEach((windowId) => {
      cachedWindowSnapshotsById.delete(windowId);
    });
  });
}

function getAppIcon(window: hs.window.WindowType): hs.image.ImageType {
  const bundleId = window.application()?.bundleID() || '';
  const cachedIcon = cachedAppIconByBundleId.get(bundleId);
  if (cachedIcon) {
    return cachedIcon;
  }

  const icon = hs.image.imageFromAppBundle(bundleId);
  cachedAppIconByBundleId.set(bundleId, icon);

  return icon;
}

function getWindowSnapshot(window: hs.window.WindowType): hs.image.ImageType {
  if (window.isMinimized()) {
    // MacOS returns an empty snapshot images for minimized windows, so
    // use our cached one instead, falling back to the (empty) snapshot if it's
    // not cached
    return cachedWindowSnapshotsById.get(window.id()) || window.snapshot();
  } else {
    // We're not minimized so MacOS will return a non-empty image
    const snapshot = window.snapshot();
    cachedWindowSnapshotsById.set(window.id(), snapshot);

    return snapshot;
  }
}

function handleWindowButtonClick(window: hs.window.WindowType) {
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

function unminimizeWindow(window: hs.window.WindowType) {
  // Most apps require just focus(), but some like LibreOffice also require raise()
  window.raise();
  window.focus();
}

function minimizeWindow(window: hs.window.WindowType) {
  // Hammerspoon returns an empty image for snapshots of minimized windows,
  // so grab an updated snapshot now before minimizing
  cachedWindowSnapshotsById.set(window.id(), window.snapshot());
  window.minimize();
}
