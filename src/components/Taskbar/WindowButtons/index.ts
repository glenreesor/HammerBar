interface ConstructorType {
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;
  backgroundColor: hs.ColorType;
}

export default class WindowButtons {
  _canvas: hs.CanvasType;
  _width: number;
  _height: number;
  _backgroundColor: hs.ColorType;

  constructor({topLeftX, topLeftY, width, height, backgroundColor}: ConstructorType) {
    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });
    this._width = width;
    this._height = height;
    this._backgroundColor = backgroundColor;

    this.update(true);
  }

  update(taskbarIsVisible: boolean) {
    if (taskbarIsVisible) {
      this._canvas.show();
      this._canvas.replaceElements(this._getBackgroundElement());
    } else {
      this._canvas.hide();
    }
  }

  _getBackgroundElement(): hs.CanvasElementType {
    return {
      type: 'rectangle',
      fillColor: this._backgroundColor,
      frame: { x: 0, y: 0, w: this._width, h: this._height},
    }
  }
}
