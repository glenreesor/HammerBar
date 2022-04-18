import { ScreenInfoType } from '../hammerspoonUtils';
import { TOGGLE_BUTTON_WIDTH } from './common';
import { getCanvasHeight } from './getCanvasHeight';

//------------------------------------------------------------------------------

interface GetNewCanvasType {
  fontSize: number;
  screen: ScreenInfoType;
}

export function getNewLeftToggleCanvas(
  {fontSize, screen }: GetNewCanvasType
): hs.CanvasType {
  const canvasHeight = getCanvasHeight(fontSize);

  return hs.canvas.new({
    x: screen.x,
    y: screen.y + screen.height - canvasHeight,
    w: TOGGLE_BUTTON_WIDTH,
    h: canvasHeight,
  });
}

//------------------------------------------------------------------------------

export function getNewRightToggleCanvas(
  {fontSize, screen }: GetNewCanvasType
): hs.CanvasType {
  const canvasHeight = getCanvasHeight(fontSize);

  return hs.canvas.new({
    x: screen.x + screen.width - TOGGLE_BUTTON_WIDTH,
    y: screen.y + screen.height - canvasHeight,
    w: TOGGLE_BUTTON_WIDTH,
    h: canvasHeight,
  });
}

//------------------------------------------------------------------------------

export function getNewWindowButtonCanvas(
  {fontSize, screen }: GetNewCanvasType
): hs.CanvasType {
  const canvasHeight = getCanvasHeight(fontSize);

  return hs.canvas.new({
    x: screen.x + TOGGLE_BUTTON_WIDTH,
    y: screen.y + screen.height - canvasHeight,
    w: screen.width - 2 * TOGGLE_BUTTON_WIDTH,
    h: canvasHeight,
  });
}
