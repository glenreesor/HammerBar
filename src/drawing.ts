import { WindowInfoType } from "./hammerspoonUtils";

export const MAX_BUTTON_WIDTH = 130;

const BUTTON_PADDING_EACH_SIDE = 3;

const BLACK = { red: 0.0, green: 0.0, blue: 0.0 };
const WHITE = { red: 1.0, green: 1.0, blue: 1.0 };

export function getCanvasHeight(fontSize: number): number {
  return fontSize * 2 + 18;
}

interface GetTaskbarElementsType {
  color: hs.ColorType;
  width: number;
  height: number;
}

export function getTaskbarElements(
  {color, width, height}: GetTaskbarElementsType
): hs.CanvasElementType {
  return {
    type: 'rectangle',
    fillColor: color,
    frame: { x: 0, y: 0, w: width, h: height},
  }
}

interface GetWindowButtonElementsType {
  fontSize: number;
  buttonWidthIncludingPadding: number;
  x: number;
  window: WindowInfoType;
  getAppNameAndWindowTitle:
    (window: WindowInfoType) => {
      appNameToDisplay: string,
      windowTitleToDisplay: string
  };
}

export function getWindowButtonElements(
  {
    fontSize,
    buttonWidthIncludingPadding,
    x,
    window,
    getAppNameAndWindowTitle,
  }: GetWindowButtonElementsType
): Array<hs.CanvasElementType> {
  const BUTTON_WIDTH = buttonWidthIncludingPadding - 2 * BUTTON_PADDING_EACH_SIDE;
  const BUTTON_HEIGHT = fontSize * 2 + 12;

  const APP_ICON_WIDTH = BUTTON_HEIGHT;
  const APP_ICON_HEIGHT = APP_ICON_WIDTH;
  const APP_ICON_PADDING_LEFT = 2;

  const TEXT_PADDING_LEFT = 0;
  const TEXT_PADDING_RIGHT = 3;

  const MAX_TEXT_WIDTH = (
    BUTTON_WIDTH -
    APP_ICON_PADDING_LEFT -
    APP_ICON_WIDTH -
    TEXT_PADDING_LEFT -
    TEXT_PADDING_RIGHT
  );

  const MINIMIZED_BACKGROUND_COLOR = { red: 190/255, green: 190/255, blue: 190/255 };

  const buttonLeftX = x + BUTTON_PADDING_EACH_SIDE;
  const buttonTopY = 4;

  const appIconX = buttonLeftX + APP_ICON_PADDING_LEFT;
  const appIconY = buttonTopY;

  const textX = appIconX + APP_ICON_WIDTH + TEXT_PADDING_LEFT;
  const textY = buttonTopY;

  // Some apps don't have a bundleId
  const appIcon = window.bundleId ? hs.image.imageFromAppBundle(window.bundleId) : null;
  const appIconAlpha = window.isMinimized ? 0.6 : 1;

  const { windowTitleToDisplay } = getAppNameAndWindowTitle(window);

  const clickId = window.id;

  const canvasElements:Array<hs.CanvasElementType> = [
    {
      // Container
      type: 'rectangle',
      fillColor: window.isMinimized ? MINIMIZED_BACKGROUND_COLOR : WHITE,
      frame: {
        x: buttonLeftX,
        y: buttonTopY,
        w: BUTTON_WIDTH,
        h: BUTTON_HEIGHT,
      },
      roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      trackMouseUp: true,
      id: clickId,
    }, {
      // App icon
      type: 'image',
      frame: {
        x: appIconX,
        y: appIconY,
        w: APP_ICON_WIDTH,
        h: APP_ICON_HEIGHT,
      },
      image: appIcon,
      imageAlpha: appIconAlpha,
    }, {
      // Text: window title
      type: 'text',
      text: windowTitleToDisplay,
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: textX,
        y: textY,
        w: MAX_TEXT_WIDTH,
        h: BUTTON_HEIGHT
      },
      trackMouseUp: true,
      id: clickId,
    },
  ];

  return canvasElements;
}
