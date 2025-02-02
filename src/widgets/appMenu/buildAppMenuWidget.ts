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

import type { WidgetBuilderParams } from 'src/mainPanel';
import { getPanelButton } from '../_helpers/panelButton';
import { getAppButton } from './appButton';
import { ConfigParams } from './types';

export function buildAppMenuWidget(
  configParams: ConfigParams,
  builderParams: WidgetBuilderParams,
) {
  const appButtons: ReturnType<typeof getAppButton>[] = [];

  function bringToFront() {
    panelButton.bringToFront();
    appButtons.forEach((appButton) => appButton.bringToFront());
  }

  function cleanupPriorToDelete() {
    panelButton.cleanupPriorToDelete();
    appButtons.forEach((appButton) => appButton.cleanupPriorToDelete());
  }

  function hide() {
    panelButton.hide();
    appButtons.forEach((appButton) => appButton.hide());
  }

  function show() {
    panelButton.show();
    appButtons.forEach((appButton) => appButton.show());
  }

  function toggleMenu() {
    if (state.menuIsVisible) {
      appButtons.forEach((appButton) => appButton.cleanupPriorToDelete());
      state.menuIsVisible = false;
    } else {
      showMenu();
      state.menuIsVisible = true;
    }
  }

  function showMenu() {
    let widgetY = builderParams.coords.y - 30 * configParams.appList.length;

    configParams.appList.forEach((app) => {
      appButtons.push(
        getAppButton({
          coords: { ...builderParams.coords, y: widgetY },
          widgetHeight: 30,
          panelColor: builderParams.panelColor,
          panelHoverColor: builderParams.panelHoverColor,
          bundleId: app.bundleId,
          label: app.label,
          onClick: () => {
            const keyboardModifiers = hs.eventtap.checkKeyboardModifiers();

            if (!keyboardModifiers.cmd && !keyboardModifiers.ctrl) {
              // Just enough of a delay to allow the click animation complete
              hs.timer.doAfter(0, toggleMenu);
            }
            hs.application.launchOrFocusByBundleID(app.bundleId);
          },
        }),
      );
      widgetY += 30;
    });
  }

  const iconInfo =
    configParams.icon === undefined
      ? {
          imagePath: `${os.getenv('HOME')}/.hammerspoon/Spoons/HammerBar.spoon/appMenuButton.png`,
        }
      : configParams.icon;

  const panelButton = getPanelButton({
    coords: builderParams.coords,
    widgetHeight: builderParams.widgetHeight,
    panelColor: builderParams.panelColor,
    panelHoverColor: builderParams.panelHoverColor,
    imageInfo: iconInfo,
    onClick: toggleMenu,
  });

  const state = {
    menuIsVisible: false,
  };

  return {
    width: panelButton.width,
    bringToFront,
    cleanupPriorToDelete,
    hide,
    show,
  };
}
