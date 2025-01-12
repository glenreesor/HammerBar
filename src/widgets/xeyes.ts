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

import { BLACK, WHITE } from 'src/constants';
import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/panel';
import { getNoopWidgetBuildingInfo } from 'src/utils';
import {
  deleteCanvasesAndStopTimers,
  hideCanvases,
  showCanvases,
} from './helpers/util';
import { DEFAULT_THEME } from 'src/theme';

type ConfigParams = {
  minInterval: number;
  maxInterval: number;
};

function isConfigParams(obj: unknown): obj is ConfigParams {
  return (
    typeof obj === 'object' &&
    typeof (obj as ConfigParams).minInterval === 'number' &&
    typeof (obj as ConfigParams).maxInterval === 'number'
  );
}

export function getXEyesBuilder(
  unvalidatedConfigParams: unknown,
): WidgetBuildingInfo {
  if (!isConfigParams(unvalidatedConfigParams)) {
    return getNoopWidgetBuildingInfo('XEyes', [
      'Unexpected argument. Expecting an argument like this:',
      '',
      '  {',
      '    minInterval = <a number>,',
      '    maxInterval = <a number>,',
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

  function getXEyesWidget({
    coords,
    height,
    panelColor,
    panelHoverColor,
  }: WidgetBuilderParams) {
    function cleanupPriorToDelete() {
      deleteCanvasesAndStopTimers([state.canvas], [state.timer]);
    }

    function hide() {
      hideCanvases([state.canvas]);
    }

    function show() {
      showCanvases([state.canvas]);
    }

    function render() {
      const mouseCoords = hs.mouse.absolutePosition();
      state.previousMouseCoords = mouseCoords;

      const eyeRadius = width / 5;
      const pupilRadius = eyeRadius / 2;

      const leftEyeCenter = { x: 2 + eyeRadius, y: height / 2 };
      const leftEyeCenterAbsolute = {
        x: coords.x + leftEyeCenter.x,
        y: coords.y + leftEyeCenter.y,
      };
      const rightEyeCenter = { x: width / 2 + 2 + eyeRadius, y: height / 2 };
      const rightEyeCenterAbsolute = {
        x: coords.x + rightEyeCenter.x,
        y: coords.y + rightEyeCenter.y,
      };

      const leftdy = leftEyeCenterAbsolute.y - mouseCoords.y;
      const leftdx = mouseCoords.x - leftEyeCenterAbsolute.x;
      let leftEyeAngleToMouse = Math.atan(leftdy / leftdx);

      if (leftdx < 0) {
        if (leftdy >= 0) {
          leftEyeAngleToMouse += Math.PI;
        } else {
          leftEyeAngleToMouse -= Math.PI;
        }
      }

      const rightdy = rightEyeCenterAbsolute.y - mouseCoords.y;
      const rightdx = mouseCoords.x - rightEyeCenterAbsolute.x;
      let rightEyeAngleToMouse = Math.atan(rightdy / rightdx);

      if (rightdx < 0) {
        if (rightdy >= 0) {
          rightEyeAngleToMouse += Math.PI;
        } else {
          rightEyeAngleToMouse -= Math.PI;
        }
      }

      const dThetaX =
        ((leftEyeAngleToMouse - state.lastPupilAngle.left) * 180) / Math.PI;
      const dThetaY =
        ((rightEyeAngleToMouse - state.lastPupilAngle.right) * 180) / Math.PI;

      if (Math.abs(dThetaX) < 10 && Math.abs(dThetaY) < 10) {
        state.interval = Math.min(state.interval * 2, configParams.maxInterval);
        state.timer = hs.timer.doAfter(state.interval, render);
        return;
      }

      state.interval = configParams.minInterval;

      const leftEyeDeltaIsBig = Math.abs(dThetaX) > 40;
      const leftEyeDeltaIsMedium = Math.abs(dThetaX) > 10;
      const randomGoofyExtraRotation = Math.random() < 0.01 ? 2 * Math.PI : 0;

      const leftEyeAngleToUse =
        state.lastPupilAngle.left +
        randomGoofyExtraRotation +
        (leftEyeDeltaIsBig
          ? Math.sign(dThetaX) / 1.2
          : leftEyeDeltaIsMedium
            ? Math.sign(dThetaX) / 4
            : 0);

      const leftPupilCenter = {
        x: leftEyeCenter.x + pupilRadius * Math.cos(leftEyeAngleToUse),
        y: leftEyeCenter.y - pupilRadius * Math.sin(leftEyeAngleToUse),
      };

      const rightEyeDeltaIsBig = Math.abs(dThetaY) > 30;
      const rightEyeDeltaIsMedium = Math.abs(dThetaY) > 10;

      const rightEyeAngleToUse =
        state.lastPupilAngle.right +
        (rightEyeDeltaIsBig
          ? Math.sign(dThetaY) / 2
          : rightEyeDeltaIsMedium
            ? Math.sign(dThetaY) / 4
            : 0);

      const rightPupilCenter = {
        x: rightEyeCenter.x + pupilRadius * Math.cos(rightEyeAngleToUse),
        y: rightEyeCenter.y - pupilRadius * Math.sin(rightEyeAngleToUse),
      };

      state.lastPupilAngle = {
        left: leftEyeAngleToUse,
        right: rightEyeAngleToUse,
      };

      state.canvas?.replaceElements([
        {
          type: 'rectangle',
          fillColor: DEFAULT_THEME.widget.normal.background,
          strokeColor: DEFAULT_THEME.widget.normal.background,
          frame: {
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
        },
        {
          type: 'circle',
          radius: eyeRadius,
          center: leftEyeCenter,
          strokeColor: DEFAULT_THEME.widget.normal.foreground,
          fillColor: WHITE,
        },
        {
          type: 'circle',
          radius: pupilRadius,
          center: leftPupilCenter,
          strokeColor: DEFAULT_THEME.widget.normal.foregroundSecondary,
          fillColor: DEFAULT_THEME.widget.normal.foregroundSecondary,
        },
        {
          type: 'circle',
          radius: eyeRadius,
          center: rightEyeCenter,
          strokeColor: DEFAULT_THEME.widget.normal.foreground,
          fillColor: WHITE,
        },
        {
          type: 'circle',
          radius: pupilRadius,
          center: rightPupilCenter,
          strokeColor: DEFAULT_THEME.widget.normal.foregroundSecondary,
          fillColor: DEFAULT_THEME.widget.normal.foregroundSecondary,
        },
      ]);
      state.timer = hs.timer.doAfter(state.interval, render);
    }

    const state: {
      values: number[];
      interval: number;
      lastPupilAngle: {
        left: number;
        right: number;
      };
      previousMouseCoords: {
        x: number;
        y: number;
      };
      canvas: hs.canvas.CanvasType | undefined;
      timer: hs.timer.TimerType | undefined;
    } = {
      values: [],
      interval: configParams.maxInterval,
      lastPupilAngle: {
        left: 0,
        right: 0,
      },
      previousMouseCoords: {
        x: 0,
        y: 0,
      },
      canvas: undefined,
      timer: undefined,
    };

    const width = height;
    state.canvas = hs.canvas.new({
      x: coords.x,
      y: coords.y,
      w: width,
      h: height,
    });

    render();
    state.canvas.show();

    return {
      bringToFront: () => state.canvas?.show(),
      cleanupPriorToDelete,
      hide,
      show,
    };
  }

  return {
    buildErrors: [],
    name: 'Xeyes',
    getWidth: (widgetHeight) => widgetHeight,
    getWidget: getXEyesWidget,
  };
}
