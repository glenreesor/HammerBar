export interface WindowInfoType {
  appName: string;
  bundleId: string;
  id: number;
  isMinimized: boolean;
  isStandard: boolean;
  role: string;
  screenId: number;
  windowTitle: string;
}

export function getWindowInfo(window: hs.WindowType): WindowInfoType {
  const application = window.application();
  let appName;
  let bundleId;

  if (application === null) {
    // Not sure what these windows are
    appName = 'Unknown';
    bundleId = '';
  } else {
    appName = application.name();
    bundleId = application.bundleID();
  }

  return {
    appName: appName,
    bundleId: bundleId || '',
    id: window.id(),
    isMinimized: window.isMinimized(),
    isStandard: window.isStandard(),
    role: window.role(),
    screenId: window.screen().id(),
    windowTitle: window.title(),
  };
}
