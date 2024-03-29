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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';
import { getPanelButton } from '../helpers/panelButton';
import { getAppButton } from './appButton';

export function getAppMenuBuilder(appList: { bundleId: string, label: string }[]): WidgetBuildingInfo {
  function getAppMenu(
    { x, y, height, panelColor, panelHoverColor }: WidgetBuilderParams
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
      let widgetY = y - 30 * appList.length;

      appList.forEach((app) => {
        appButtons.push(
          getAppButton({
            x,
            y: widgetY,
            height: 30,
            panelColor,
            panelHoverColor,
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
          })
        );
        widgetY += 30;
      });
    }

    const panelButton = getPanelButton({
      x,
      y,
      height,
      panelColor,
      panelHoverColor,
      imageInfo: {
        imagePath: `${os.getenv('HOME')}/.hammerspoon/Spoons/HammerBar.spoon/appMenuButton.png`
      },
      onClick: toggleMenu,
    });

    const state = {
      menuIsVisible: false,
    };

    return {
      bringToFront,
      cleanupPriorToDelete,
      hide,
      show,
    };
  }

  return {
    buildErrors: [],
    getWidth: (widgetHeight) => widgetHeight,
    getWidget: getAppMenu,
  };
};
