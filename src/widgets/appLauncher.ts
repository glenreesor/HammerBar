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

import type { WidgetBuilder } from 'src/Panel';

export function getAppLauncherBuilder(bundleId: string): WidgetBuilder {
  return function AppLauncher({ x, y, height }) {
    function destroy() {
      canvas.delete();
    }

    const mouseCallback: hs.CanvasMouseCallbackType = function(this: void) {
      hs.application.launchOrFocusByBundleID(bundleId);
    }

    function render() {
      canvas.appendElements(
        [
          {
            type: 'rectangle',
            fillColor: { red: 1, green: 1, blue: 1 },
            frame: {
              x: 0,
              y: 0,
              w: height,
              h: height,
            },
            trackMouseUp: true,
          },
          {
            type: 'image',
            frame: {
              x: IMAGE_PADDING,
              y: (height - imageWidth) / 2,
              w: imageWidth,
              h: imageWidth,
            },
            image: hs.image.imageFromAppBundle(bundleId),
          },
        ]
      );
    }

    const width = height;
    const IMAGE_PADDING = 2;
    const imageWidth = width - 2 * IMAGE_PADDING;
    const canvas = hs.canvas.new({ x, y, w: width, h: height });

    render();
    canvas.mouseCallback(mouseCallback);
    canvas.show();

    return {
      bringToFront: () => canvas.show(),
      destroy,
      hide: () => canvas.hide(),
      show: () => canvas.show(),
    };
  }
};
