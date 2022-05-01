import { BLACK, WHITE } from 'src/constants';
import { MenuAppType } from 'src/Taskbar';

interface ConstructorType {
  bottomLeftX: number;
  bottomLeftY: number;
  fontSize: number;
  appList: Array<MenuAppType>;
}

const MENU_WIDTH = 120;
const HEIGHT_PER_APP = 30;
const VERTICAL_ROW_PADDING = 4;

export default class AppMenu {
  _canvas: hs.CanvasType;
  _iAmVisible: boolean;
  _appList: Array<MenuAppType>;

  constructor({bottomLeftX, bottomLeftY, fontSize, appList}: ConstructorType) {
    this._appList = appList;

    const height =
      appList.length * (HEIGHT_PER_APP + VERTICAL_ROW_PADDING) -
      VERTICAL_ROW_PADDING;

    this._canvas = hs.canvas.new({
      x: bottomLeftX,
      y: bottomLeftY - height,
      w: MENU_WIDTH,
      h: height,
    });

    this._canvas.appendElements({
      type: 'rectangle',
      fillColor: WHITE,
      frame: {
        x: 0,
        y: 0,
        w: MENU_WIDTH,
        h: height,
      }
    });

    this._addApps(fontSize, appList);
    this._canvas.mouseCallback(
      (
        canvas: hs.CanvasType,
        message: string,
        id: number | string
      ) => this._onAppClick(canvas, message, id)
    );
    this._canvas.show();
    this._iAmVisible = true;
  }

  toggleVisibility() {
    if (this._iAmVisible) {
      this._hide();
    } else {
      this._show();
    }
  }

  _hide() {
    this._canvas.hide();
    this._iAmVisible = false;
  }

  _show() {
    this._canvas.show();
    this._iAmVisible = true;
  }

  _addApps(fontSize: number, appList: Array<MenuAppType>) {
    const VERTICAL_PADDING = 4;
    const HORIZONTAL_PADDING = 4;
    const height = HEIGHT_PER_APP - VERTICAL_PADDING;

    let y = VERTICAL_PADDING;

    appList.forEach((app, index) => {
      this._canvas.appendElements(
        this._getOneAppElements(
          HORIZONTAL_PADDING,
          y,
          height,
          MENU_WIDTH - 2 * HORIZONTAL_PADDING,
          fontSize,
          app,
          index
        )
      );
      y += HEIGHT_PER_APP;
    });
  }

  _getOneAppElements(
    x: number,
    y: number,
    height: number,
    width: number,
    fontSize: number,
    app: MenuAppType,
    appId: number,
  ): Array<hs.CanvasElementType> {
    const APP_ICON_PADDING_LEFT = 2;

    const TEXT_PADDING_LEFT = 0;
    const TEXT_PADDING_RIGHT = 5;

    const appIconWidth = height;
    const appIconHeight = appIconWidth;
    const appIconX = x + APP_ICON_PADDING_LEFT;
    const appIconY = y;

    const textX = appIconX + appIconWidth + TEXT_PADDING_LEFT;

    // We're only expecting one line of text, so center it on the icon
    const textY = appIconY + appIconHeight / 2 - 1.4 * fontSize / 2;

    const maxTextWidth = (
      width -
      APP_ICON_PADDING_LEFT -
      appIconWidth -
      TEXT_PADDING_LEFT -
      TEXT_PADDING_RIGHT
    );

    return [
      {
        type: 'rectangle',
        fillColor: { red: 0.8, green: 0.8, blue: 0.8 },
        frame: {
          x: x,
          y: y,
          w: width,
          h: height,
        },
        roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      },
      {
        type: 'image',
        frame: {
          x: appIconX,
          y: appIconY,
          w: appIconWidth,
          h: appIconHeight,
        },
        image: hs.image.imageFromAppBundle(app.bundleId),
        trackMouseUp: true,
        id: appId,
      },
      {
        type: 'text',
        text: app.displayName,
        textColor: BLACK,
        textSize: fontSize,
        frame: {
          x: textX,
          y: textY,
          w: maxTextWidth,
          h: height,
        },
        trackMouseUp: true,
        id: appId,
      },
    ];
  }

  _onAppClick(_canvas: hs.CanvasType, _message: string, id: number | string) {
    const idAsNumber = (typeof id === 'number') ? id : parseInt(id);
    hs.application.launchOrFocusByBundleID(this._appList[idAsNumber].bundleId);
    this._hide();
  }
}
