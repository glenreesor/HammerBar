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

import { BLACK, WHITE } from 'src/constants';
import type { WidgetBuilderParams, WidgetBuildingInfo } from 'src/Panel';

export function getXEyesBuilder(interval: number): WidgetBuildingInfo {
  const buildErrors: string[] = [];

  function getXEyesWidget(
    { x, y, height, panelColor, panelHoverColor }: WidgetBuilderParams
  ) {
    function destroy() {
      canvas.delete();
    }

    function render() {
      const mouseCoords = hs.mouse.absolutePosition();

      const eyeRadius = width / 5;
      const pupilRadius = eyeRadius / 2;

      const leftEyeCenter = {x: 2 + eyeRadius, y: height / 2};
      const leftEyeCenterAbsolute = {
        x: x + leftEyeCenter.x,
        y: y + leftEyeCenter.y,
      };
      const rightEyeCenter = {x: width / 2 + 2 + eyeRadius, y: height / 2};
      const rightEyeCenterAbsolute = {
        x: x + rightEyeCenter.x,
        y: y + rightEyeCenter.y,
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
      const leftPupilCenter = {
        x: leftEyeCenter.x + pupilRadius * Math.cos(leftEyeAngleToMouse),
        y: leftEyeCenter.y - pupilRadius * Math.sin(leftEyeAngleToMouse)
      };

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
      const rightPupilCenter = {
        x: rightEyeCenter.x + pupilRadius * Math.cos(rightEyeAngleToMouse),
        y: rightEyeCenter.y - pupilRadius * Math.sin(rightEyeAngleToMouse)
      };

      canvas.replaceElements(
        [
          {
            type: 'rectangle',
            fillColor: panelHoverColor,
            strokeColor: panelColor,
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
            strokeColor: BLACK,
            fillColor: WHITE,
          },
          {
            type: 'circle',
            radius: pupilRadius,
            center: leftPupilCenter,
            strokeColor: BLACK,
            fillColor: BLACK,
          },
          {
            type: 'circle',
            radius: eyeRadius,
            center: rightEyeCenter,
            strokeColor: BLACK,
            fillColor: WHITE,
          },
          {
            type: 'circle',
            radius: pupilRadius,
            center: rightPupilCenter,
            strokeColor: BLACK,
            fillColor: BLACK,
          },
        ],
      );
      state.timer = hs.timer.doAfter(interval, render);
    }

    const state: {
      timer?: hs.TimerType
      values: number[]
    } = {
      values: [],
    };

    const width = height;
    const canvas = hs.canvas.new({ x, y, w: width, h: height });

    render();
    canvas.show();

    return {
      bringToFront: () => canvas.show(),
      destroy,
      hide: () => canvas.hide(),
      show: () => canvas.show(),
    };
  }

  return {
    buildErrors,
    getWidth: (widgetHeight) => widgetHeight,
    getWidget: getXEyesWidget,
  };
};
