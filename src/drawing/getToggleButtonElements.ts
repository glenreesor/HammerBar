import { BLACK, TOGGLE_BUTTON_WIDTH } from './common';
import { getCanvasHeight } from './getCanvasHeight';

interface GetToggleButtonElementsType {
  fontSize: number,
  screenSide: 'left' | 'right';
  taskbarIsVisible: boolean;
}

export function getToggleButtonElements({
  fontSize,
  screenSide,
  taskbarIsVisible,
}: GetToggleButtonElementsType) {
  let toggleSymbol;

  if (screenSide === 'left') {
    toggleSymbol = taskbarIsVisible ? '<' : '>';
  } else {
    toggleSymbol = taskbarIsVisible ? '>' : '<';
  }

  const canvasElements:Array<hs.CanvasElementType> = [
    {
      type: 'rectangle',
      fillColor: { red: 100/255, green: 100/255, blue: 100/255 },
      frame: {
        x: 0,
        y: 0,
        w: TOGGLE_BUTTON_WIDTH,
        h: getCanvasHeight(fontSize),
      },
      trackMouseUp: true,
    },
    {
      type: 'text',
      text: toggleSymbol,
      textColor: BLACK,
      textSize: fontSize,
      frame: {
        x: TOGGLE_BUTTON_WIDTH / 4,
        y: getCanvasHeight(fontSize) / 2 - fontSize / 2,
        w: fontSize,
        h: fontSize,
      },
      trackMouseUp: true,
    },
  ];

  return canvasElements;
}
