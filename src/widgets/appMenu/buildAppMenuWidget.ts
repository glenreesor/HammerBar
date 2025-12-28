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

import type { WidgetLayout } from 'src/mainPanel';
import { getPanelButton } from '../_helpers/panelButton';
import { getAppButton } from './appButton';
import { WidgetConfig } from './types';

export function buildAppMenuWidget(
  widgetConfig: WidgetConfig,
  widgetLayout: WidgetLayout,
) {
  const appButtons: ReturnType<typeof getAppButton>[] = [];

  function bringToFront() {
    panelButton.bringToFront();
    appButtons.forEach((appButton) => appButton.bringToFront());
  }

  function prepareForRemoval() {
    panelButton.prepareForRemoval();
    appButtons.forEach((appButton) => appButton.prepareForRemoval());
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
      appButtons.forEach((appButton) => appButton.prepareForRemoval());
      state.menuIsVisible = false;
    } else {
      showMenu();
      state.menuIsVisible = true;
    }
  }

  function showMenu() {
    let widgetY = widgetLayout.coords.y - 30 * widgetConfig.appList.length;

    widgetConfig.appList.forEach((app) => {
      appButtons.push(
        getAppButton({
          coords: { ...widgetLayout.coords, y: widgetY },
          widgetHeight: 30,
          panelColor: widgetLayout.panelColor,
          panelHoverColor: widgetLayout.panelHoverColor,
          bundleId: app.bundleId,
          label: app.label,
          onClick: () => {
            const keyboardModifiers = hs.eventtap.checkKeyboardModifiers();

            if (!keyboardModifiers.cmd && !keyboardModifiers.ctrl) {
              // Just enough of a delay to allow the click animation complete
              hs.timer.doAfter(0, toggleMenu);
            }

            const optionalNewInstanceFlag = app.newInstance ? '-n' : '';
            const args = app.args ? `--args ${app.args.join(' ')}` : '';

            const handle = io.popen(
              `open ${optionalNewInstanceFlag} -b ${app.bundleId} ${args}`,
            );
            handle.close();
          },
        }),
      );
      widgetY += 30;
    });
  }

  const iconInfo =
    widgetConfig.icon === undefined
      ? {
          imagePath: `${os.getenv('HOME')}/.hammerspoon/Spoons/HammerBar.spoon/appMenuButton.png`,
        }
      : widgetConfig.icon;

  const panelButton = getPanelButton({
    coords: widgetLayout.coords,
    widgetHeight: widgetLayout.widgetHeight,
    panelColor: widgetLayout.panelColor,
    panelHoverColor: widgetLayout.panelHoverColor,
    imageInfo: iconInfo,
    hoverLabel: widgetConfig.hoverLabel,
    onClick: toggleMenu,
  });

  const state = {
    menuIsVisible: false,
  };

  return {
    width: panelButton.width,
    bringToFront,
    prepareForRemoval,
    hide,
    show,
  };
}
