interface GetTaskbarElementsType {
  color: hs.ColorType;
  width: number;
  height: number;
}

export function getTaskbarElements(
  {color, width, height}: GetTaskbarElementsType
): hs.CanvasElementType {
  return {
    type: 'rectangle',
    fillColor: color,
    frame: { x: 0, y: 0, w: width, h: height},
  }
}

