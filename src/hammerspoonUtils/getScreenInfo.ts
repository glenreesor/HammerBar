// Return a table with the following fields corresponding to the passed-in
// hammerspoon screen object
//
//  id     - string
//  name   - string
//  x      - number
//  y      - number
//  width  - number
//  height - number

export interface ScreenInfoType {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getScreenInfo(screen: hs.ScreenType): ScreenInfoType {

  const id = screen.id();
  let name = screen.name();

  // VNC Server doesn't have a name
  if (name === null) {
    name = 'Unknown';
  }

  const frame = screen.frame();

  return {
    id,
    name,
    x: frame.x,
    y: frame.y,
    width: frame.w,
    height: frame.h,
  };
}
