import { WindowInfoType } from "./hammerspoonUtils";

export interface ColorType {
  red: number;
  green: number;
  blue: number;
}
export const BUTTON_PADDING = 5;
export const DEFAULT_BUTTON_WIDTH = 130;

const BLACK = { red: 0.0, green: 0.0, blue: 0.0 };
const WHITE = { red: 1.0, green: 1.0, blue: 1.0 };

export function getButtonHeight(fontSize: number): number {
  return fontSize * 2 + 8;
}

export function getCanvasHeight(fontSize: number): number {
  return fontSize * 2 + 14;
}

interface GetTaskbarElementsType {
  color: ColorType;
  width: number;
  height: number;
}

export function getTaskbarElements(
  {color, width, height}: GetTaskbarElementsType
) {
  return {
    type: 'rectangle',
    fillColor: color,
    frame: { x: 0, y: 0, w: width, h: height},
  }
}

interface GetWindowButtonElementsType {
  fontSize: number;
  buttonWidth: number;
  x: number;
  y: number;
  window: WindowInfoType;
  getAppNameAndWindowTitle:
    (window: WindowInfoType) => {
      appNameToDisplay: string,
      windowTitleToDisplay: string
  };
  getWindowIconColor: (window: WindowInfoType) => ColorType;
}

export function getWindowButtonElements(
  {
    fontSize,
    buttonWidth,
    x,
    y,
    window,
    getAppNameAndWindowTitle,
    getWindowIconColor,
  }: GetWindowButtonElementsType
) {
  const ICON_WIDTH = 15;
  const ICON_PADDING_LEFT = 4;
  const TEXT_PADDING_LEFT = 3;
  const VERTICAL_PADDING = 2;

  const MAX_TEXT_WIDTH = (
    buttonWidth -
    ICON_WIDTH -
    ICON_PADDING_LEFT -
    TEXT_PADDING_LEFT -
    4
  );

  const buttonHeight = getButtonHeight(fontSize);

  const iconX = x + ICON_PADDING_LEFT;
  const textX = iconX + ICON_WIDTH + TEXT_PADDING_LEFT;
  const textLine1Y = y;
  const textLine2Y = textLine1Y + fontSize + VERTICAL_PADDING;

  let iconHeight;
  let iconY;

  if (window.isMinimized) {
    iconHeight = fontSize - 1;
    iconY = y + fontSize + VERTICAL_PADDING * 2;
  } else {
    iconHeight = fontSize * 2 - 1;
    iconY = y + 4;
  }

  const iconColor = getWindowIconColor(window);

  const {
    appNameToDisplay,
    windowTitleToDisplay
  } = getAppNameAndWindowTitle(window);

  const clickId = window.id;

  const canvasElements = [
    {
      // Container
      type: 'rectangle',
      fillColor: WHITE,
      frame: {
        x: x,
        y: y,
        w: buttonWidth,
        h: buttonHeight,
      },
      roundedRectRadii: { xRadius: 5.0, yRadius: 5.0 },
      trackMouseUp: true,
      id: clickId,
    }, {
      // Icon
      type: 'rectangle',
      fillColor: iconColor,
      frame: { x: iconX, y: iconY, w: ICON_WIDTH, h: iconHeight },
      roundedRectRadii: { xRadius: 6.0, yRadius: 6.0 },
      trackMouseUp: true,
      id: clickId,
    }, {
      // Text: window title
      type: 'text',
      text: windowTitleToDisplay,
      textColor: BLACK,
      textSize: fontSize,
      textLineBreak: 'clip',
      frame: {
        x: textX,
        y: textLine1Y,
        w: MAX_TEXT_WIDTH,
        h: fontSize + 8,
      },
      trackMouseUp: true,
      id: clickId,
    }, {
      // Text: App Name
      type: 'text',
      text: appNameToDisplay,
      textColor: BLACK,
      textSize: fontSize,
      textLineBreak: 'clip',
      frame: {
        x: textX,
        y: textLine2Y,
        w: MAX_TEXT_WIDTH,
        h: fontSize + 8,
      },
      trackMouseUp: true,
      id: clickId,
    }
  ];

  // Hack for now to make it easy to quickly see which windows aren't "standard"
  if (!window.isStandard) {
    canvasElements.push({
      type: 'rectangle',
      fillColor: BLACK,
      strokeColor: BLACK,
      frame: {
        x: iconX + ICON_WIDTH / 2,
        y: iconY,
        w: 1,
        h: iconHeight,
      }
    });
  }

  return canvasElements;
}
