import { ScreenInfoType, WindowInfoType } from 'src/hammerspoonUtils';
import ToggleButton  from './ToggleButton';
import WindowButtons from './WindowButtons';

interface ConstructorType {
  fontSize: number;
  screenInfo: ScreenInfoType;
  backgroundColor: hs.ColorType;
  onToggleButtonClick: (this: void) => void;
  onWindowButtonClick: (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;
}

const TOGGLE_BUTTON_WIDTH = 20;

export default class Taskbar {
  _leftToggleButton: ToggleButton;
  _rightToggleButton: ToggleButton;
  _windowButtons: WindowButtons;

  constructor({
    fontSize,
    screenInfo,
    backgroundColor,
    onToggleButtonClick,
    onWindowButtonClick
  }: ConstructorType) {
    const canvasHeight = fontSize * 2 + 18;

    this._leftToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'left',
      width: TOGGLE_BUTTON_WIDTH,
      height: canvasHeight,
      topLeftX: screenInfo.x,
      topLeftY: screenInfo.y + screenInfo.height - canvasHeight,
      onClick: onToggleButtonClick,
    });

    this._rightToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'right',
      width: TOGGLE_BUTTON_WIDTH,
      height: canvasHeight,
      topLeftX: screenInfo.x + screenInfo.width - TOGGLE_BUTTON_WIDTH,
      topLeftY: screenInfo.y + screenInfo.height - canvasHeight,
      onClick: onToggleButtonClick,
    });

    this._windowButtons = new WindowButtons({
      topLeftX: screenInfo.x + TOGGLE_BUTTON_WIDTH,
      topLeftY: screenInfo.y + screenInfo.height - canvasHeight,
      width: screenInfo.width - 2 * TOGGLE_BUTTON_WIDTH,
      height: canvasHeight,
      backgroundColor: backgroundColor,
      fontSize: fontSize,
      onWindowButtonClick: onWindowButtonClick,
    });
  }

  update(taskbarIsVisible: boolean, windows: Array<WindowInfoType>) {
    this._leftToggleButton.update(taskbarIsVisible);
    this._rightToggleButton.update(taskbarIsVisible);
    this._windowButtons.update(taskbarIsVisible, windows);
  }
}
