import { LauncherConfigType } from 'src/types';
import { ScreenInfoType, WindowInfoType } from 'src/hammerspoonUtils';
import LauncherButton from './components/LauncherButton';
import ToggleButton  from './components/ToggleButton';
import WindowButtons from './components/WindowButtons';

interface ConstructorType {
  fontSize: number;
  height: number;
  screenInfo: ScreenInfoType;
  backgroundColor: hs.ColorType;
  launchers: LauncherConfigType[];
  onToggleButtonClick: (this: void) => void;
  onWindowButtonClick:
    (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;
}

const TOGGLE_BUTTON_WIDTH = 20;
const LAUNCHER_BUTTON_WIDTH = 40;

export default class Taskbar {
  _fontSize: number;
  _height: number;
  _screenInfo: ScreenInfoType;
  _backgroundColor: hs.ColorType;
  _launchersConfig: LauncherConfigType[];
  _onToggleButtonClick: (this: void) => void;
  _onWindowButtonClick:
    (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;

  _launcherButtons: LauncherButton[] = [];
  _leftToggleButton?: ToggleButton;
  _rightToggleButton?: ToggleButton;
  _windowButtons?: WindowButtons;

  constructor({
    fontSize,
    height,
    screenInfo,
    backgroundColor,
    launchers,
    onToggleButtonClick,
    onWindowButtonClick
  }: ConstructorType) {
    this._fontSize = fontSize;
    this._height = height;
    this._screenInfo = screenInfo;
    this._backgroundColor = backgroundColor;
    this._launchersConfig = launchers;
    this._onToggleButtonClick = onToggleButtonClick;
    this._onWindowButtonClick = onWindowButtonClick;

    this._createAllElements();
  }

  update(taskbarIsVisible: boolean, windows: Array<WindowInfoType>) {
    if (this._leftToggleButton && this._rightToggleButton && this._windowButtons) {
      this._leftToggleButton.update(taskbarIsVisible);
      this._rightToggleButton.update(taskbarIsVisible);
      this._windowButtons.update(taskbarIsVisible, windows);

      this._launcherButtons.forEach((launcherButton) => {
        launcherButton.update(taskbarIsVisible);
      });
    }
  }

  updateSizeAndPosition(newScreenInfo: ScreenInfoType) {
    if (
      newScreenInfo.x !== this._screenInfo.x ||
      newScreenInfo.y !== this._screenInfo.y ||
      newScreenInfo.width !== this._screenInfo.width ||
      newScreenInfo.height !== this._screenInfo.height
    ) {
      print(`Recreating taskbar for screen ${newScreenInfo.id} because size and/or position has changed`);

      // Hide all existing elements
      this._leftToggleButton?.hide();
      this._rightToggleButton?.hide();
      this._launcherButtons.forEach((launcherButton) => {
        launcherButton.update(false);
      });
      this._windowButtons?.update(false, []);

      // Create new elements (thus letting garbage collector deal with old ones)
      this._screenInfo = newScreenInfo;
      this._launcherButtons = [];
      this._createAllElements();
    }
  }

  _createAllElements() {
    // Create objects that live in the taskbar, left to right
    const y = this._screenInfo.y + this._screenInfo.height - this._height;
    let x = this._screenInfo.x;

    this._leftToggleButton = this._getNewToggleButton('left', x, y);
    x += TOGGLE_BUTTON_WIDTH;

    this._launchersConfig.forEach((launcher) => {
      this._launcherButtons.push(this._getNewLauncherButton(x, y, launcher));
      x += LAUNCHER_BUTTON_WIDTH;
    });

    const windowButtonsWidth = this._screenInfo.width - (
      2 * TOGGLE_BUTTON_WIDTH +
      this._launchersConfig.length * LAUNCHER_BUTTON_WIDTH
    );

    this._windowButtons = this._getNewWindowButtons(x, y, windowButtonsWidth);
    x += windowButtonsWidth;

    this._rightToggleButton = this._getNewToggleButton('right', x, y);
  }

  _getNewLauncherButton(x: number, y: number, launcher: LauncherConfigType) {
    return new LauncherButton({
      topLeftX: x,
      topLeftY: y,
      width: LAUNCHER_BUTTON_WIDTH,
      height: this._height,
      fontSize: this._fontSize,
      launcherDetails: launcher,
    })
  }

  _getNewToggleButton(screenSide: 'left' | 'right', x: number, y: number) {
    return new ToggleButton({
      fontSize: this._fontSize,
      screenSide: screenSide,
      width: TOGGLE_BUTTON_WIDTH,
      height: this._height,
      topLeftX: x,
      topLeftY: y,
      onClick: this._onToggleButtonClick,
    });
  }

  _getNewWindowButtons(x: number, y: number, windowButtonsWidth: number) {
    return new WindowButtons({
      topLeftX: x,
      topLeftY: y,
      width: windowButtonsWidth,
      height: this._height,
      backgroundColor: this._backgroundColor,
      fontSize: this._fontSize,
      onWindowButtonClick: this._onWindowButtonClick,
    });
  }
}
