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

import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/panel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import { getPanelButton } from '../helpers/panelButton';
import { getAppButton } from './appButton';

type IconInfo =
  | { bundleId: string; imagePath: undefined }
  | { bundleId: undefined; imagePath: string };

type ConfigParams = {
  appList: { bundleId: string; label: string }[];
  icon?: IconInfo;
};

function isAppListArray(obj: unknown): boolean {
  return (
    Array.isArray(obj) &&
    obj.reduce(
      (accum, curr) =>
        accum &&
        typeof curr.bundleId === 'string' &&
        typeof curr.label === 'string',
      true,
    )
  );
}

function isIconInfo(obj: unknown): boolean {
  return (
    (typeof (obj as IconInfo).bundleId === 'string' &&
      typeof (obj as IconInfo).imagePath === 'undefined') ||
    (typeof (obj as IconInfo).bundleId === 'undefined' &&
      typeof (obj as IconInfo).imagePath === 'string')
  );
}

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    isAppListArray((obj as ConfigParams).appList) &&
    (typeof (obj as ConfigParams).icon === 'undefined' ||
      isIconInfo((obj as ConfigParams).icon))
  );
}

export function getAppMenuBuilder(
  unvalidatedConfigParams: unknown,
): WidgetBuildingInfo {
  if (!isConfigParams(unvalidatedConfigParams)) {
    return getNoopWidgetBuildingInfo('LineGraph', [
      'Unexpected argument. Expecting an argument like this:',
      '',
      '  {',
      '    { bundleId = "org.mozilla.firefox", label = "Firefox" },',
      '    { bundleId = "com.google.Chrome", label = "Chrome" },',
      '  }',
      '',
      'But instead this was received:',
      '',
      hs.inspect.inspect(unvalidatedConfigParams),
    ]);
  }

  // This looks goofy because the type checking should suffice since it
  // correctly narrows the type of unvalidatedBundleId.
  //
  // However it appears that typescript doesn't maintain that knowledge
  // within the function below.
  const configParams = unvalidatedConfigParams;

  const { appList, icon } = configParams;

  function getAppMenuWidget({
    coords,
    height,
    panelColor,
    panelHoverColor,
  }: WidgetBuilderParams) {
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
      let widgetY = coords.y - 30 * appList.length;

      appList.forEach((app) => {
        appButtons.push(
          getAppButton({
            coords: { x: coords.x, y: widgetY },
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
          }),
        );
        widgetY += 30;
      });
    }

    const iconInfo =
      icon === undefined
        ? {
            imagePath: `${os.getenv('HOME')}/.hammerspoon/Spoons/HammerBar.spoon/appMenuButton.png`,
          }
        : icon;

    const panelButton = getPanelButton({
      coords,
      height,
      panelColor,
      panelHoverColor,
      imageInfo: iconInfo,
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
    name: 'AppMenu',
    getWidth: (widgetHeight) => widgetHeight,
    getWidget: getAppMenuWidget,
  };
}
