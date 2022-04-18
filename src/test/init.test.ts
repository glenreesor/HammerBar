import { WindowInfoType } from "../hammerspoonUtils/getWindowInfo";
import { testableFunctions } from '../init';

const { orderWindowsConsistently, windowListsAreIdentical } = testableFunctions;
const windowTemplate = {
  id: 1,
  bundleId: '1',
  appName: 'iTerm',
  isMinimized: true,
  isStandard: true,
  screenId: 2,
  windowTitle: 'My title',
};

describe('orderWindowsConsistently()', () => {
  it('handles the case where window array is empty', () => {
    const windows: WindowInfoType[] = [];
    orderWindowsConsistently(windows);
    expect(windows).toStrictEqual([]);
  });

  it('handles the case where window array has one element', () => {
    const window = windowTemplate;
    const windows = [window];

    orderWindowsConsistently(windows);
    expect(windows).toStrictEqual([window]);
  });

  it('handles the case where multiple windows have same appName and id', () => {
    const window1 = windowTemplate;
    const windows = [window1, window1];

    orderWindowsConsistently(windows);
    expect(windows).toStrictEqual([window1, window1]);
  });

  it('handles the case where multiple windows have same appName and different ids', () => {
    const window1 = windowTemplate;
    const window2 = {
      ...windowTemplate,
      id: 2,
    };
    const window3 = {
      ...window1,
      id: 3,
    };
    const windows = [window3, window2, window1];

    orderWindowsConsistently(windows);
    expect(windows).toStrictEqual([window1, window2, window3]);
  });

  it('handles the case where there are multiple apps and multiple windows per app', () => {
    // Windows corresponding to App1
    const app1Window1 = {
      ...windowTemplate,
      appName: 'app1',
      id: 1,
    };
    const app1Window2 = {
      ...app1Window1,
      id: 2,
    };
    const app1Window3 = {
      ...app1Window1,
      id: 3,
    };

    // Windows corresponding to App2
    const app2Window1 = {
      ...windowTemplate,
      appName: 'app2',
      id: 1,
    };
    const app2Window2 = {
      ...app2Window1,
      id: 2,
    };
    const app2Window3 = {
      ...app2Window1,
      id: 3,
    };

    // Windows corresponding to App3
    const app3Window1 = {
      ...windowTemplate,
      appName: 'app3',
      id: 1,
    };
    const app3Window2 = {
      ...app3Window1,
      id: 2,
    };
    const app3Window3 = {
      ...app3Window1,
      id: 3,
    };

    const windows = [
      app3Window3,
      app3Window2,
      app3Window1,
      app2Window3,
      app2Window2,
      app2Window1,
      app1Window3,
      app1Window2,
      app1Window1,
    ];

    orderWindowsConsistently(windows);

    expect(windows).toStrictEqual([
      app1Window1,
      app1Window2,
      app1Window3,
      app2Window1,
      app2Window2,
      app2Window3,
      app3Window1,
      app3Window2,
      app3Window3,
    ]);
  });
});

describe('windowsListsAreIdentical()', () => {
  it('returns true if both lists are empty', () => {
    expect(windowListsAreIdentical([], [])).toBe(true);
  });

  it('returns false if one list is empty', () => {
    expect(windowListsAreIdentical([windowTemplate], [])).toBe(false);
  });

  it('returns true if all windows identical', () => {
    const windowList1 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
      },
    ];

    const windowList2 = windowList1;

    expect(windowListsAreIdentical(windowList1, windowList2)).toBe(true);
  });

  it('returns false if a window has a different appName', () => {
    const windowList1 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
      },
    ];

    const windowList2 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        appName: 'a different appName',
        id: 2,
      },
    ];

    expect(windowListsAreIdentical(windowList1, windowList2)).toBe(false);
  });

  it('returns false if a window has a different windowTitle', () => {
    const windowList1 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
      },
    ];

    const windowList2 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        windowTitle: 'a different appName',
        id: 2,
      },
    ];

    expect(windowListsAreIdentical(windowList1, windowList2)).toBe(false);
  });

  it('returns false if a window has a different minimized state', () => {
    const windowList1 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
      },
    ];

    const windowList2 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
        isMinimized: !windowTemplate.isMinimized,
      },
    ];

    expect(windowListsAreIdentical(windowList1, windowList2)).toBe(false);
  });

  it('returns false if a window has a multiple different properties', () => {
    const windowList1 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
      },
    ];

    const windowList2 = [
      {
        ...windowTemplate,
        id: 1,
      },
      {
        ...windowTemplate,
        id: 2,
        appName: 'a different appName',
        windowTitle: 'a different windowTitle',
        isMinimized: !windowTemplate.isMinimized,
      },
    ];

    expect(windowListsAreIdentical(windowList1, windowList2)).toBe(false);
  });
});
