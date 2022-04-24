import { ScreenInfoType } from 'src/hammerspoonUtils';
import ToggleButton  from './ToggleButton';

interface ConstructorType {
  fontSize: number;
  screenInfo: ScreenInfoType;
  onToggleButtonClick: (this: void) => void;
}

const TOGGLE_BUTTON_WIDTH = 20;

export default class Taskbar {
  _leftToggleButton: ToggleButton;
  _rightToggleButton: ToggleButton;

  constructor({fontSize, screenInfo, onToggleButtonClick}: ConstructorType) {
    const canvasHeight = fontSize * 2 + 18;

    this._leftToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'left',
      width: TOGGLE_BUTTON_WIDTH,
      height: canvasHeight,
      topLeftX: screenInfo.x,
      topLeftY: screenInfo.y + screenInfo.height - 2 * canvasHeight,
      onClick: onToggleButtonClick,
    });

    this._rightToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'right',
      width: TOGGLE_BUTTON_WIDTH,
      height: canvasHeight,
      topLeftX: screenInfo.x + screenInfo.width - TOGGLE_BUTTON_WIDTH,
      topLeftY: screenInfo.y + screenInfo.height - 2 * canvasHeight,
      onClick: onToggleButtonClick,
    });

  }

  update(taskbarIsVisible: boolean) {
    this._leftToggleButton.update(taskbarIsVisible);
    this._rightToggleButton.update(taskbarIsVisible);
  }
}
