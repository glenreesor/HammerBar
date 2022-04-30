import { ScreenInfoType, WindowInfoType } from 'src/hammerspoonUtils';
import AppMenuButton from './AppMenuButton';
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
const APP_MENU_BUTTON_WIDTH = 40;

export default class Taskbar {
  _leftToggleButton: ToggleButton;
  _rightToggleButton: ToggleButton;
  _windowButtons: WindowButtons;
  _appMenuButton: AppMenuButton;

  constructor({
    fontSize,
    screenInfo,
    backgroundColor,
    onToggleButtonClick,
    onWindowButtonClick
  }: ConstructorType) {
    const canvasHeight = fontSize * 2 + 18;

    const topLeftY = screenInfo.y + screenInfo.height - canvasHeight;
    const leftToggleButtonX = screenInfo.x;
    const appMenuButtonX = leftToggleButtonX + TOGGLE_BUTTON_WIDTH;
    const windowButtonsX = appMenuButtonX + APP_MENU_BUTTON_WIDTH;
    const windowButtonsWidth = screenInfo.width - (
      2 * TOGGLE_BUTTON_WIDTH +
      APP_MENU_BUTTON_WIDTH
    );

    this._leftToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'left',
      width: TOGGLE_BUTTON_WIDTH,
      height: canvasHeight,
      topLeftX: leftToggleButtonX,
      topLeftY: topLeftY,
      onClick: onToggleButtonClick,
    });

    this._appMenuButton = new AppMenuButton({
      topLeftX: appMenuButtonX,
      topLeftY: topLeftY,
      widthIncludingPadding: APP_MENU_BUTTON_WIDTH,
      height: canvasHeight,
      onClick: () => this._onAppMenuButtonClick(),
    });

    this._windowButtons = new WindowButtons({
      topLeftX: windowButtonsX,
      topLeftY: topLeftY,
      width: windowButtonsWidth,
      height: canvasHeight,
      backgroundColor: backgroundColor,
      fontSize: fontSize,
      onWindowButtonClick: onWindowButtonClick,
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
  }

  update(taskbarIsVisible: boolean, windows: Array<WindowInfoType>) {
    this._leftToggleButton.update(taskbarIsVisible);
    this._rightToggleButton.update(taskbarIsVisible);
    this._windowButtons.update(taskbarIsVisible, windows);
    this._appMenuButton.update(taskbarIsVisible);
  }

  _onAppMenuButtonClick() {
    hs.application.launchOrFocusByBundleID('com.apple.launchpad.launcher');
  }
}
