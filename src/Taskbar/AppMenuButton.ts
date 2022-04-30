interface ConstructorType {
  topLeftX: number;
  topLeftY: number;
  widthIncludingPadding: number;
  height: number;
  onClick: (this: void) => void;
}

const BACKGROUND_COLOR = { red: 100/255, green: 100/255, blue: 100/255 };
const IMAGE_PADDING = 2;

export default class AppMenuButton {
  _canvas: hs.CanvasType;

  constructor({
    topLeftX,
    topLeftY,
    widthIncludingPadding,
    height,
    onClick,
  }: ConstructorType) {
    this._canvas = hs.canvas.new({
      x: topLeftX,
      y: topLeftY,
      w: widthIncludingPadding,
      h: height,
    });

    const image = hs.image.imageFromAppBundle('com.apple.launchpad.launcher');
    const imageWidth = widthIncludingPadding - 2 * IMAGE_PADDING;

    this._canvas.appendElements(
      [
        {
          type: 'rectangle',
          fillColor: BACKGROUND_COLOR,
          frame: {
            x: 0,
            y: 0,
            w: widthIncludingPadding,
            h: height,
          },
          trackMouseUp: true,
        },
        {
          type: 'image',
          frame: {
            x: IMAGE_PADDING,
            y: (height - imageWidth) / 2,
            w: imageWidth,
            h: imageWidth,
          },
          image: image,
        },
      ]
    );

    this._canvas.mouseCallback(onClick);
    this._canvas.show();
  }

  update(isVisible: boolean) {
    if (isVisible) {
      this._canvas.show();
    } else {
      this._canvas.hide();
    }
  }
}

