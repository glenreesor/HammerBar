import { LauncherConfigType } from 'src/types';

interface ConstructorType {
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;
  launcherDetails: LauncherConfigType;
}

const BACKGROUND_COLOR = { red: 100/255, green: 100/255, blue: 100/255 };
const IMAGE_PADDING = 2;

export default class LauncherButton {
  _canvas: hs.CanvasType;
  _launcherConfig: LauncherConfigType;

  constructor({
    topLeftX,
    topLeftY,
    width,
    height,
    launcherDetails,
  }: ConstructorType) {
    this._launcherConfig = launcherDetails;
    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });

    const image = hs.image.imageFromAppBundle(
      launcherDetails.type === 'app'
        ? launcherDetails.bundleId
        : 'com.apple.launchpad.launcher'
    );

    const imageWidth = width - 2 * IMAGE_PADDING;

    this._canvas.appendElements(
      [
        {
          type: 'rectangle',
          fillColor: BACKGROUND_COLOR,
          frame: {
            x: 0,
            y: 0,
            w: width,
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
          image: image,
        },
      ]
    );

    this._canvas.mouseCallback(() => this._onClick());
    this._canvas.show();
  }

  update(isVisible: boolean) {
    if (isVisible) {
      this._canvas.show();
    } else {
      this._canvas.hide();
    }
  }

  _onClick() {
    if (this._launcherConfig.type === 'app') {
      hs.application.launchOrFocusByBundleID(this._launcherConfig.bundleId);
    } else {
      print('clicked a menu');
    }
  }
}

