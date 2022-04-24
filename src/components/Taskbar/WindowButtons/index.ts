import { BLACK, WHITE } from 'src/constants';
import { WindowInfoType } from 'src/hammerspoonUtils/getWindowInfo';

interface ConstructorType {
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;
  backgroundColor: hs.ColorType;
  fontSize: number;
}

const MAX_BUTTON_WIDTH = 130;

export default class WindowButtons {
  _canvas: hs.CanvasType;
  _width: number;
  _height: number;
  _backgroundColor: hs.ColorType;
  _fontSize: number;

  constructor({topLeftX, topLeftY, width, height, backgroundColor, fontSize}: ConstructorType) {
    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });
    this._width = width;
    this._height = height;
    this._backgroundColor = backgroundColor;
    this._fontSize = fontSize;

    this.update(true, []);
  }

  update(taskbarIsVisible: boolean, windows: Array<WindowInfoType>) {
    if (taskbarIsVisible) {
      this._canvas.show();

      this._canvas.replaceElements();
      this._addBackgroundElement();
      this._addWindowsElements(windows);
    } else {
      this._canvas.hide();
    }
  }

  _addBackgroundElement(): void {
    this._canvas.appendElements({
      type: 'rectangle',
      fillColor: this._backgroundColor,
      frame: { x: 0, y: 0, w: this._width, h: this._height},
    });
  }

  _addWindowsElements(windows: Array<WindowInfoType>): void {
    this._orderWindowsConsistently(windows);

    const buttonWidth = this._getButtonWidth(windows.length);

    let x = 0;
    windows.forEach((window) => {
      this._canvas.appendElements(this._getWindowButtonElements(x, buttonWidth, window));
      x += buttonWidth;
    });
  }

  _getButtonWidth(numberOfButtons: number): number {
    const widthToFillTaskbar = this._width / numberOfButtons;

    // Now adjust because we don't want gigantic buttons
    const buttonWidth = Math.min(MAX_BUTTON_WIDTH, widthToFillTaskbar);

    return buttonWidth;
  }

  _getWindowButtonElements(x: number, widthIncludingPadding: number, window: WindowInfoType): Array<hs.CanvasElementType> {
    const BUTTON_PADDING_EACH_SIDE = 3;
    const BUTTON_PADDING_TOP_AND_BOTTOM = 4;

    const APP_ICON_PADDING_LEFT = 2;

    const TEXT_PADDING_LEFT = 0;
    const TEXT_PADDING_RIGHT = 3;

    const buttonWidth = widthIncludingPadding - 2 * BUTTON_PADDING_EACH_SIDE;
    const buttonLeftX = x + BUTTON_PADDING_EACH_SIDE;
    const buttonTopY = BUTTON_PADDING_TOP_AND_BOTTOM;
    const buttonHeight = this._height - 2 * BUTTON_PADDING_TOP_AND_BOTTOM;

    const appIconWidth = buttonHeight;
    const appIconHeight = appIconWidth;
    const appIcon = hs.image.imageFromAppBundle(window.bundleId);
    const appIconX = buttonLeftX + APP_ICON_PADDING_LEFT;
    const appIconY = buttonTopY;

    const textX = appIconX + appIconWidth + TEXT_PADDING_LEFT;
    const textY = buttonTopY;
    const maxTextWidth = (
      buttonWidth -
      APP_ICON_PADDING_LEFT -
      appIconWidth -
      TEXT_PADDING_LEFT -
      TEXT_PADDING_RIGHT
    );

    return [
      {
        // Container
        type: 'rectangle',
        fillColor: WHITE,
        frame: {
          x: buttonLeftX,
          y: buttonTopY,
          w: buttonWidth,
          h: buttonHeight,
        },
        roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      }, {
        // App icon
        type: 'image',
        frame: {
          x: appIconX,
          y: appIconY,
          w: appIconWidth,
          h: appIconHeight,
        },
        image: appIcon,
      },
      {
        // Text: window title
        type: 'text',
        text: window.windowTitle,
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: textX,
          y: textY,
          w: maxTextWidth,
          h: buttonHeight
        },
      },
    ];
  }

  /**
   * Modify the specified array of windows so they will be ordered consistently
   * every render, independent of the order that Hammerspoon provides them, so
   * the window buttons won't change positions on different renders
   */
  _orderWindowsConsistently(windows: WindowInfoType[]): void {
    // Sort by appname so window buttons are grouped by app, and then by
    // window ID within app
    windows.sort((window1, window2) => {
      if (window1.appName < window2.appName) {
        return -1;
      }

      if (window1.appName === window2.appName) {
        if (window1.id < window2.id) {
          return -1;
        }

        if (window1.id === window2.id) {
          // Presumably this will never happen
          return 0;
        }
      }

      return 1;
    });
  }
}
