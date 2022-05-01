import { ScreenInfoType, WindowInfoType } from 'src/hammerspoonUtils';
import AppMenu from 'src/AppMenu';
import AppMenuButton from './AppMenuButton';
import ToggleButton  from './ToggleButton';
import WindowButtons from './WindowButtons';

interface ConstructorType {
  fontSize: number;
  height: number;
  screenInfo: ScreenInfoType;
  backgroundColor: hs.ColorType;
  onToggleButtonClick: (this: void) => void;
  onWindowButtonClick: (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;
}

const TOGGLE_BUTTON_WIDTH = 20;
const APP_MENU_BUTTON_WIDTH = 40;

export default class Taskbar {
  _appMenu: AppMenu | undefined;
  _leftToggleButton: ToggleButton;
  _rightToggleButton: ToggleButton;
  _windowButtons: WindowButtons;
  _appMenuButton: AppMenuButton;

  _topLeftX: number;
  _topLeftY: number;
  _fontSize: number;

  constructor({
    fontSize,
    height,
    screenInfo,
    backgroundColor,
    onToggleButtonClick,
    onWindowButtonClick
  }: ConstructorType) {
    this._topLeftX = screenInfo.x;
    this._topLeftY = screenInfo.y + screenInfo.height - height;
    this._fontSize = fontSize;

    const leftToggleButtonX = this._topLeftX;
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
      height: height,
      topLeftX: leftToggleButtonX,
      topLeftY: this._topLeftY,
      onClick: onToggleButtonClick,
    });

    this._appMenuButton = new AppMenuButton({
      topLeftX: appMenuButtonX,
      topLeftY: this._topLeftY,
      width: APP_MENU_BUTTON_WIDTH,
      height: height,
      onClick: () => this._onAppMenuButtonClick(),
    });

    this._windowButtons = new WindowButtons({
      topLeftX: windowButtonsX,
      topLeftY: this._topLeftY,
      width: windowButtonsWidth,
      height: height,
      backgroundColor: backgroundColor,
      fontSize: fontSize,
      onWindowButtonClick: onWindowButtonClick,
    });

    this._rightToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'right',
      width: TOGGLE_BUTTON_WIDTH,
      height: height,
      topLeftX: screenInfo.x + screenInfo.width - TOGGLE_BUTTON_WIDTH,
      topLeftY: screenInfo.y + screenInfo.height - height,
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
    if (!this._appMenu) {
      this._appMenu = new AppMenu({
        bottomLeftX: this._topLeftX,
        bottomLeftY: this._topLeftY - 1,
        fontSize: this._fontSize,
      });
    } else {
      this._appMenu.toggleVisibility();
    }
  }
}
