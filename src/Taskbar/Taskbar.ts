import { ScreenInfoType, WindowInfoType } from 'src/hammerspoonUtils';
import AppMenu from 'src/AppMenu';
import AppMenuButton from './AppMenuButton';
import ToggleButton  from './ToggleButton';
import WindowButtons from './WindowButtons';
import { MenuAppType } from './index';

interface ConstructorType {
  fontSize: number;
  height: number;
  screenInfo: ScreenInfoType;
  backgroundColor: hs.ColorType;
  onToggleButtonClick: (this: void) => void;
  onWindowButtonClick: (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;
}

const appList1: Array<MenuAppType> = [
  {
    bundleId: 'org.mozilla.firefox',
    displayName: 'Firefox',
  },
  {
    bundleId: 'com.googlecode.iterm2',
    displayName: 'iTerm',
  },
]

const appList2: Array<MenuAppType> = [
  {
    bundleId: 'org.libreoffice.script',
    displayName: 'Firefox',
  },
  {
    bundleId: 'com.googlecode.iterm2',
    displayName: 'iTerm',
  },
]

const TOGGLE_BUTTON_WIDTH = 20;
const APP_MENU_BUTTON_WIDTH = 40;

export default class Taskbar {
  _appMenu1: AppMenu | undefined;
  _appMenu2: AppMenu | undefined;
  _leftToggleButton: ToggleButton;
  _rightToggleButton: ToggleButton;
  _windowButtons: WindowButtons;
  _appMenuButton1: AppMenuButton;
  _appMenuButton2: AppMenuButton;

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
    const appMenuButton1X = leftToggleButtonX + TOGGLE_BUTTON_WIDTH;
    const appMenuButton2X = appMenuButton1X + APP_MENU_BUTTON_WIDTH;
    const windowButtonsX = appMenuButton2X + APP_MENU_BUTTON_WIDTH;

    const windowButtonsWidth = screenInfo.width - (
      2 * TOGGLE_BUTTON_WIDTH +
      2 * APP_MENU_BUTTON_WIDTH
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

    this._appMenuButton1 = new AppMenuButton({
      topLeftX: appMenuButton1X,
      topLeftY: this._topLeftY,
      width: APP_MENU_BUTTON_WIDTH,
      height: height,
      onClick: () => this._onAppMenuButton1Click(),
    });

    this._appMenuButton2 = new AppMenuButton({
      topLeftX: appMenuButton2X,
      topLeftY: this._topLeftY,
      width: APP_MENU_BUTTON_WIDTH,
      height: height,
      onClick: () => this._onAppMenuButton2Click(),
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
    this._appMenuButton1.update(taskbarIsVisible);
    this._appMenuButton2.update(taskbarIsVisible);
  }

  _onAppMenuButton1Click() {
    if (!this._appMenu1) {
      this._appMenu1 = new AppMenu({
        bottomLeftX: this._topLeftX + TOGGLE_BUTTON_WIDTH,
        bottomLeftY: this._topLeftY - 1,
        fontSize: this._fontSize,
        appList: appList1,
      });
    } else {
      this._appMenu1.toggleVisibility();
    }
  }

  _onAppMenuButton2Click() {
    if (!this._appMenu2) {
      this._appMenu2 = new AppMenu({
        bottomLeftX: this._topLeftX + TOGGLE_BUTTON_WIDTH + APP_MENU_BUTTON_WIDTH,
        bottomLeftY: this._topLeftY - 1,
        fontSize: this._fontSize,
        appList: appList2,
      });
    } else {
      this._appMenu2.toggleVisibility();
    }
  }
}
