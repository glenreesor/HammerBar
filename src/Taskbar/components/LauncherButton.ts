import { LauncherConfigType } from 'src/types';
import AppMenu from 'src/AppMenu';

interface ConstructorType {
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;
  fontSize: number;
  launcherDetails: LauncherConfigType;
}

const BACKGROUND_COLOR = { red: 100/255, green: 100/255, blue: 100/255 };
const IMAGE_PADDING = 2;

export default class LauncherButton {
  _appMenu: AppMenu | undefined;
  _canvas: hs.CanvasType;
  _fontSize: number;
  _launcherConfig: LauncherConfigType;
  _topLeftX: number;
  _topLeftY: number;

  constructor({
    topLeftX,
    topLeftY,
    width,
    height,
    fontSize,
    launcherDetails,
  }: ConstructorType) {
    this._fontSize = fontSize;
    this._launcherConfig = launcherDetails;
    this._topLeftX = topLeftX;
    this._topLeftY = topLeftY;

    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });

    const image = launcherDetails.type === 'app'
      ? hs.image.imageFromAppBundle(launcherDetails.bundleId)
      : hs.image.imageFromPath(
        os.getenv('HOME') + '/.hammerspoon/Spoons/HammerBar.spoon/appMenuButton.png'
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
      if (!this._appMenu) {
        this._appMenu = new AppMenu({
          bottomLeftX: this._topLeftX,
          bottomLeftY: this._topLeftY - 1,
          fontSize: this._fontSize,
          appList: this._launcherConfig.apps,
        });
      } else {
        this._appMenu.toggleVisibility();
      }
    }
  }
}

