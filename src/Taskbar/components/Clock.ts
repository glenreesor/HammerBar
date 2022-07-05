import { BLACK } from 'src/constants';

interface ConstructorType {
  fontSize: number;
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;
  backgroundColor: hs.ColorType;
}

export default class Clock {
  _backgroundColor: hs.ColorType;
  _canvas: hs.CanvasType;
  _fontSize: number;
  _height: number;
  _width: number;

  constructor({ fontSize, topLeftX, topLeftY, width, height, backgroundColor }: ConstructorType) {
    this._fontSize = fontSize;
    this._width = width;
    this._height = height;
    this._backgroundColor = backgroundColor;

    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: width,
      h: height,
    });

    this.update(true);
  }

  hide() {
    this._canvas.hide();
  }

  update(taskbarIsVisible: boolean) {
    if (taskbarIsVisible) {
      this._canvas.show();
      this._canvas.replaceElements(this._getCanvasElements());
    } else {
      this._canvas.hide();
    }
  }

  _getCanvasElements(): Array<hs.CanvasElementType> {
    const { formattedTime, formattedDate } = this._getFormattedDateTime();

    const timeY = this._height / 2 - this._fontSize - this._fontSize / 2;
    const dateY = timeY + this._fontSize * 1.6;

    return [
      {
        type: 'rectangle',
        fillColor: this._backgroundColor,
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
        text: formattedTime,
        textAlignment: 'center',
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: 0,
          y: timeY,
          w: this._width,
          h: this._fontSize * 1.2,
        },
      },
      {
        type: 'text',
        text: formattedDate,
        textAlignment: 'center',
        textColor: BLACK,
        textSize: this._fontSize,
        frame: {
          x: 0,
          y: dateY,
          w: this._width,
          h: this._fontSize * 1.2,
        },
      },
    ] as Array<hs.CanvasElementType>;
  }

  _getFormattedDateTime(): { formattedTime: string, formattedDate: string } {
    const now = os.date('*t') as os.DateTable;

    const hour = now.hour < 13 ? now.hour : now.hour - 12;
    const minute = `${now.min < 10 ? '0' : ''}${now.min}`;
    const ampm = now.hour < 13 ? 'am' : 'pm';

    const year = now.year;
    const month = `${now.month < 10 ? '0' : ''}${now.month}`;
    const day = `${now.day < 10 ? '0' : ''}${now.day}`;

    return {
      formattedTime: `${hour}:${minute} ${ampm}`,
      formattedDate: `${year}-${month}-${day}`,
    };
  }
}
