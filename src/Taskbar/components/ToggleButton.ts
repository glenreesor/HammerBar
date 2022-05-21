import { BLACK } from 'src/constants';

interface ConstructorType {
  fontSize: number;
  screenSide: 'left' | 'right';
  width: number;
  height: number;
  topLeftX: number;
  topLeftY: number;
  onClick: (this: void) => void;
}

export default class ToggleButton {
  _fontSize: number;
  _canvas: hs.CanvasType;
  _screenSide: 'left' | 'right';
  _width: number;
  _height: number;

  constructor(
  {
    fontSize,
    screenSide,
    height,
    width,
    topLeftX,
    topLeftY,
    onClick,
  }: ConstructorType) {
    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });
    this._canvas.mouseCallback(onClick);

    this._fontSize = fontSize;
    this._screenSide = screenSide;
    this._width = width;
    this._height = height;

    this.update(true);
  }

  hide() {
    this._canvas.hide();
  }

  update(taskbarIsVisible: boolean) {
    let toggleSymbol;

    if (this._screenSide === 'left') {
      toggleSymbol = taskbarIsVisible ? '<' : '>';
    } else {
      toggleSymbol = taskbarIsVisible ? '>' : '<';
    }

    this._canvas.replaceElements(this._getCanvasElements(toggleSymbol));
    this._canvas.show();
  }

  _getCanvasElements(toggleSymbol: string): Array<hs.CanvasElementType> {
    return [
      {
        type: 'rectangle',
        fillColor: { red: 100/255, green: 100/255, blue: 100/255 },
        frame: {
          x: 0,
          y: 0,
          w: this._width,
          h: this._height,
        },
        trackMouseUp: true,
      },
      {
        type: 'text',
        text: toggleSymbol,
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: this._width / 4,
          y: this._height / 2 - this._fontSize / 2,
          w: this._fontSize,
          h: this._fontSize * 1.2,
        },
        trackMouseUp: true,
      },
    ];
  }
}
