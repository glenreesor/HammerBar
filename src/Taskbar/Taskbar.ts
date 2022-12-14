// Copyright 2022 Glen Reesor
//
// This file is part of HammerBar.
//
// HammerBar is free software: you can redistribute it and/or
// modify it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or (at your
// option) any later version.
//
// HammerBar is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.
//
// You should have received a copy of the GNU General Public License along with
// HammerBar. If not, see <https://www.gnu.org/licenses/>.

import { LauncherConfigType } from 'src/types';
import { printDiagnostic } from 'src/utils';
import { ScreenInfoType, WindowInfoType } from 'src/hammerspoonUtils';
import Clock from './components/Clock';
import LauncherButton from './components/LauncherButton';
import ToggleButton  from './components/ToggleButton';
import WindowButtons from './components/WindowButtons';

const CLOCK_WIDTH = 100;
const LAUNCHER_BUTTON_WIDTH = 40;
const TOGGLE_BUTTON_WIDTH = 20;

/**
 * An object that creates all the objects required to render a taskbar
 */
export default class Taskbar {
  _fontSize: number;
  _height: number;
  _screenInfo: ScreenInfoType;
  _backgroundColor: hs.ColorType;
  _launchersConfig: LauncherConfigType[];
  _showClock: boolean;
  _onToggleButtonClick: (this: void) => void;
  _onWindowButtonClick:
    (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;

  _clock?: Clock;
  _launcherButtons: LauncherButton[] = [];
  _leftToggleButton?: ToggleButton;
  _rightToggleButton?: ToggleButton;
  _windowButtons?: WindowButtons;

  /**
   * Create and render all the objects required to render a taskbar
   *
   * @param fontSize
   * @param height              Total height of the taskbar
   * @param screenInfo          An object describing the screen (monitor) on which to render the taskbar
   * @param backgroundColor
   * @param launchers           A list of objects describing launchers to be rendered, in the order
   *                            left to right
   * @param showClock           Whether to show a clock at the right side of the taskbar
   * @param onToggleButtonClick Click handler for the left and right toggle buttons
   * @param onWindowButtonClick Click handler for any of the app/window buttons in the taskbar
   */
  constructor({
    fontSize,
    height,
    screenInfo,
    backgroundColor,
    launchers,
    showClock,
    onToggleButtonClick,
    onWindowButtonClick
  }: {
    fontSize: number;
    height: number;
    screenInfo: ScreenInfoType;
    backgroundColor: hs.ColorType;
    launchers: LauncherConfigType[];
    showClock: boolean;
    onToggleButtonClick: (this: void) => void;
    onWindowButtonClick:
      (this: void, _canvas: hs.CanvasType, _message: string, id: string | number) => void;
  }) {
    this._fontSize = fontSize;
    this._height = height;
    this._screenInfo = screenInfo;
    this._backgroundColor = backgroundColor;
    this._launchersConfig = launchers;
    this._showClock = showClock,
    this._onToggleButtonClick = onToggleButtonClick;
    this._onWindowButtonClick = onWindowButtonClick;

    this._createAllElements();
  }

  /**
   * Update a taskbar -- both its visibility and the list of window buttons to render
   */
  update(taskbarIsVisible: boolean, windows: WindowInfoType[]) {
    if (this._leftToggleButton && this._rightToggleButton && this._windowButtons) {
      this._leftToggleButton.update(taskbarIsVisible);
      this._rightToggleButton.update(taskbarIsVisible);
      this._windowButtons.update(taskbarIsVisible, windows);

      this._launcherButtons.forEach((launcherButton) => {
        launcherButton.update(taskbarIsVisible);
      });

      this._clock?.update(taskbarIsVisible);
    }
  }

  /**
   * Update the size and position of this taskbar (useful when monitors are added or removed)
   */
  updateSizeAndPosition(newScreenInfo: ScreenInfoType) {
    if (
      newScreenInfo.x !== this._screenInfo.x ||
      newScreenInfo.y !== this._screenInfo.y ||
      newScreenInfo.width !== this._screenInfo.width ||
      newScreenInfo.height !== this._screenInfo.height
    ) {
      printDiagnostic([
        `Recreating taskbar for screen ${newScreenInfo.name} (${newScreenInfo.id})`,
        'because size and/or position has changed',
      ]);

      // Hide all existing elements
      this._leftToggleButton?.hide();
      this._rightToggleButton?.hide();
      this._launcherButtons.forEach((launcherButton) => {
        launcherButton.update(false);
      });
      this._windowButtons?.update(false, []);
      this._clock?.hide();

      // Create new elements (thus letting garbage collector deal with old ones)
      this._screenInfo = newScreenInfo;
      this._launcherButtons = [];
      this._createAllElements();
    }
  }

  /**
   * Create all the elements that make up a taskbar, and assigning those to instance variables
   */
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
      this._launchersConfig.length * LAUNCHER_BUTTON_WIDTH +
      (this._showClock ? CLOCK_WIDTH : 0)
    );

    this._windowButtons = this._getNewWindowButtons(x, y, windowButtonsWidth);
    x += windowButtonsWidth;

    if (this._showClock) {
      this._clock = this._getNewClock(x, y);
      x += CLOCK_WIDTH;
    }

    this._rightToggleButton = this._getNewToggleButton('right', x, y);
  }

  /**
   * Return a newly created clock component
   */
  _getNewClock(x: number, y: number) {
    return new Clock({
      fontSize: this._fontSize,
      topLeftX: x,
      topLeftY: y,
      width: CLOCK_WIDTH,
      height: this._height,
      backgroundColor: this._backgroundColor,
    });
  }

  /**
   * Return a newly created launcher button
   */
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

  /**
   * Return a newly created toggle button
   */
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

  /**
   * Return a newly created component that renders all the specified window buttons
   */
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
