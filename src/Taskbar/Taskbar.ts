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
  _launcherButtons: LauncherButton[];
  _leftToggleButton: ToggleButton;
  _rightToggleButton: ToggleButton;
  _windowButtons: WindowButtons;

  constructor({
    fontSize,
    height,
    screenInfo,
    backgroundColor,
    launchers,
    onToggleButtonClick,
    onWindowButtonClick
  }: ConstructorType) {
    this._launcherButtons = [];

    // Create objects that live in the taskbar, left to right
    const y = screenInfo.y + screenInfo.height - height;
    let x = screenInfo.x;

    this._leftToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'left',
      width: TOGGLE_BUTTON_WIDTH,
      height: height,
      topLeftX: x,
      topLeftY: y,
      onClick: onToggleButtonClick,
    });
    x += TOGGLE_BUTTON_WIDTH;

    launchers.forEach((launcher) => {
      this._launcherButtons.push(
        new LauncherButton({
          topLeftX: x,
          topLeftY: y,
          width: LAUNCHER_BUTTON_WIDTH,
          height: height,
          fontSize: fontSize,
          launcherDetails: launcher,
        })
      );
      x += LAUNCHER_BUTTON_WIDTH;
    });

    const windowButtonsWidth = screenInfo.width - (
      2 * TOGGLE_BUTTON_WIDTH +
      launchers.length * LAUNCHER_BUTTON_WIDTH
    );

    this._windowButtons = new WindowButtons({
      topLeftX: x,
      topLeftY: y,
      width: windowButtonsWidth,
      height: height,
      backgroundColor: backgroundColor,
      fontSize: fontSize,
      onWindowButtonClick: onWindowButtonClick,
    });
    x += windowButtonsWidth;

    this._rightToggleButton = new ToggleButton({
      fontSize: fontSize,
      screenSide: 'right',
      width: TOGGLE_BUTTON_WIDTH,
      height: height,
      topLeftX: x,
      topLeftY: y,
      onClick: onToggleButtonClick,
    });
  }

  update(taskbarIsVisible: boolean, windows: Array<WindowInfoType>) {
    this._leftToggleButton.update(taskbarIsVisible);
    this._rightToggleButton.update(taskbarIsVisible);
    this._windowButtons.update(taskbarIsVisible, windows);

    this._launcherButtons.forEach((launcherButton) => {
      launcherButton.update(taskbarIsVisible);
    });
  }
}
