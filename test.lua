-- This requires the busted testing library

local hb = require('init')

--------------------------------------------------------------------------------

-- Return a mock hammerspoon window satisfying the specified criteria.
-- Required keys in windowObjectDetails:
--  applicationName - string
--  id              - string
--  isMinimized     - boolean
--  isStandard      - boolean
--  screenId        - string
--  title           - string
function getMockHammerspoonWindow(windowObjectDetails)
  return {
    application = function()
      return { name = function() return windowObjectDetails.applicationName end }
    end,
    id = function() return windowObjectDetails.id end,
    isMinimized = function() return windowObjectDetails.isMinimized end,
    isStandard = function() return windowObjectDetails.isStandard end,
    screen = function()
      return { id = function() return windowObjectDetails.screenId end }
    end,
    title = function() return windowObjectDetails.title end,
  }
end

--------------------------------------------------------------------------------
-- hb.util tests
--------------------------------------------------------------------------------

describe('hb.util.contains', function()

  it('should return false if the haystack is empty', function()
    assert.is_false(hb.util.contains({}, 'needle'))
  end)

  it('should return false when needle not found in non-empty haystack', function()
    assert.is_false(hb.util.contains({ a = 'something' }, 'needle'))
  end)

  it('should return true when needle is found in haystack', function()
    assert.is_true(true, hb.util.contains({ a = 'needle' }, 'needle'))
  end)

end)


describe('hb.util.filter', function()
  it('should return an empty table if the input table is empty', function()
    local l = {}

    l.input = {}
    l.expected = {}

    l.filteringFunction = function(value, key) return false end

    assert.are.same(
      l.expected,
      hb.util.filter(l.input, l.filteringFunction)
    )
  end)

  it('should return an empty table if the filtering function always returns false', function()
    local l = {}

    l.input = { a = 1, b = 2 }
    l.expected = {}

    l.filteringFunction = function(value, key) return false end

    assert.are.same(
      l.expected,
      hb.util.filter(l.input, l.filteringFunction)
    )
  end)

  it('should return a proper table -- correct value passed to filtering function', function()
    local l = {}

    l.input = { keep1 = 1, keep2 = 2, dontKeep1 = 3, dontKeep2 = 4 }
    l.expected = { keep1 = 1, keep2 = 2 }

    l.filteringFunction = function(value, key)
      if (value == 1 or value == 2) then
      return true
      else
        return false
      end
    end

    assert.are.same(
      l.expected,
      hb.util.filter(l.input, l.filteringFunction)
    )
  end)

  it('should return a proper table -- correct key passed to filtering function', function()
    local l = {}

    l.input = { keep1 = 1, keep2 = 2, dontKeep1 = 3, dontKeep2 = 4 }
    l.expected = { keep1 = 1, keep2 = 2 }

    l.filteringFunction = function(value, key)
      if (key == 'keep1' or key == 'keep2') then
      return true
      else
        return false
      end
    end

    assert.are.same(
      l.expected,
      hb.util.filter(l.input, l.filteringFunction)
    )
  end)

end)


describe('hb.util.indexOf', function()

  it('should return -1 if the haystack is empty', function()
    assert.are.same(
      -1,
      hb.util.indexOf({}, 'needle')
    )
  end)

  it('should return -1 when needle not found in non-empty haystack', function()
    assert.are.same(
      -1,
      hb.util.indexOf({ 'something' }, 'needle')
    )
  end)

  it('should return index of first needle in haystack', function()
    assert.are.same(
      2,
      hb.util.indexOf({ 'pencil', 'needle', 'needle' }, 'needle')
    )
  end)

end)

--------------------------------------------------------------------------------
-- hb.display tests
--------------------------------------------------------------------------------

describe('hb.display functions', function()
  before_each(hb.display.resetUserConfig)

  describe('hb.display.getAppNameAndWindowTitle', function()

    it('should return unmodified name and title if no user config', function()
      local windowInfo = {
        appName = 'app name input',
        windowTitle = 'window title input',
      }

      assert.are.same(
        windowInfo,
        hb.display.getAppNameAndWindowTitle(windowInfo)
      )
    end)

    it('should return unmodified name and title if no match', function()
      local windowInfo = {
        appName = 'app name input',
        windowTitle = 'window title input',
      }

      hb:setAppNamesAndWindowTitles(
        {
          {
            appName = 'a non-matching appName',
            windowTitle = 'a non-matching windowTitle',
            displayAppName = 'modified app name',
            displayWindowTitle = 'modified window title',
          }
        }
      )

      assert.are.same(
        windowInfo,
        hb.display.getAppNameAndWindowTitle(windowInfo)
      )
    end)

    it('should return modified name and title if window pattern is nil', function()
      local windowInfo = {
        appName = 'app name input',
        windowTitle = 'window title input',
      }

      hb:setAppNamesAndWindowTitles(
        {
          {
            appName = 'app name input',
            windowTitle = nil,
            displayAppName = 'modified app name',
            displayWindowTitle = 'modified window title',
          }
        }
      )

      assert.are.same(
      { appName = 'modified app name', windowTitle = 'modified window title' },
        hb.display.getAppNameAndWindowTitle(windowInfo)
      )
    end)

    it('should return unmodified app name if displayAppName is nil', function()
      local windowInfo = {
        appName = 'app name input',
        windowTitle = 'window title input',
      }

      hb:setAppNamesAndWindowTitles(
        {
          {
            appName = 'app name input',
            windowTitle = 'window title input',
            displayAppName = nil,
            displayWindowTitle = 'modified window title',
          }
        }
      )

      assert.are.same(
      { appName = 'app name input', windowTitle = 'modified window title' },
        hb.display.getAppNameAndWindowTitle(windowInfo)
      )
    end)

    it('should return unmodified title if displayWindowTitle is nil', function()
      local windowInfo = {
        appName = 'app name input',
        windowTitle = 'window title input',
      }

      hb:setAppNamesAndWindowTitles(
        {
          {
            appName = 'app name input',
            windowTitle = 'window title input',
            displayAppName = 'modified app name',
            displayWindowTitle = nil,
          }
        }
      )

      assert.are.same(
      { appName = 'modified app name', windowTitle = 'window title input' },
        hb.display.getAppNameAndWindowTitle(windowInfo)
      )
    end)

  end)


  describe('hb.display.getDefaultColors', function()

    it('should have appropriate keys and values', function()
      local l = {}

      assert.are.same(
        {
          taskbar = { red = 180/255, green = 180/255, blue = 180/255 },
          icons   = { red = 132/255, green = 132/255, blue = 130/255 },
        },
        hb.display.getDefaultColors()
      )
    end)

  end)


  describe('hb.display.getTaskbarColor', function()

    it('should return the default color when no user-supplied colors', function()
      assert.are.same(
        hb.display.getDefaultColors().taskbar,
        hb.display.getTaskbarColor()
      )
    end)

    it('should return the user-supplied color', function()
      local l = {}

      l.taskbarColor = { red = 1, green = 1, blue = 1 }
      local userColors = { taskbar = l.taskbarColor }
      hb:setColors(userColors)

      assert.are.same(
        l.taskbarColor,
        hb.display.getTaskbarColor()
      )
    end)

  end)


  describe('hb.display.getWindowIconColor', function()
    local windowInfo = {
      appName = 'TestAppName'
    }

    it('should return default color if user has not specified one', function()
      assert.are.same(
        hb.display.getDefaultColors().icons,
        hb.display.getWindowIconColor(windowInfo)
      )
    end)

    it(
      'should return default color if user specified colors, but not for apps',
      function()
        hb:setColors({})

        assert.are.same(
          hb.display.getDefaultColors().icons,
          hb.display.getWindowIconColor(windowInfo)
        )
      end)

    it(
      'should return default color if user specified app colors, but not for this one',
      function()
        hb:setColors({ appNames = { userApp = { red = 1, blue = 1, green = 1 }}})

        assert.are.same(
          hb.display.getDefaultColors().icons,
          hb.display.getWindowIconColor(windowInfo)
        )
      end)

    it(
      'should return user color when it\'s a simple RGB color',
      function()
        local userColor = { red = 1, blue = 1, green = 1 }
        hb:setColors({ appNames = { TestAppName = userColor }})

        assert.are.same(
          userColor,
          hb.display.getWindowIconColor(windowInfo)
        )
      end)

    it(
      'should return user color when it\'s specified as an appGroup name',
      function()
        local userColor = { red = 1, blue = 1, green = 1 }
        hb:setColors(
          {
            appGroups = {
              AppGroupName = userColor,
            },
            appNames = {
              TestAppName = 'AppGroupName'
            },
          }
        )

        assert.are.same(
          userColor,
          hb.display.getWindowIconColor(windowInfo)
        )
      end)
  end)
end)

--------------------------------------------------------------------------------
-- hb.hsData tests
--------------------------------------------------------------------------------

describe('hb.hsData.getScreenInfo', function()

  it('should return all values for a normal screen', function()
    local l = {}

    l.mockScreen = {
      id = function() return 'Screen ID' end,
      name = function() return 'Screen Name' end,
      frame = function() return {
        x = 1,
        y = 2,
        w = 3,
        h = 4,
      } end,
    }

    l.screenInfo = hb.hsData.getScreenInfo(l.mockScreen)

    assert.are.same(
      {
        id = 'Screen ID',
        name = 'Screen Name',
        x = 1,
        y = 2,
        width = 3,
        height = 4,
      },
      l.screenInfo
    )
  end)

  it('should return proper values for a VNC screen', function()
    local l = {}

    l.mockScreen = {
      id = function() return 'Screen ID' end,
      name = function() return nil end,
      frame = function() return {
        x = 1,
        y = 2,
        w = 3,
        h = 4,
      } end,
    }

    l.screenInfo = hb.hsData.getScreenInfo(l.mockScreen)
    assert.are.same(
      {
        id = 'Screen ID',
        name = 'Unknown',
        x = 1,
        y = 2,
        width = 3,
        height = 4,
      },
      l.screenInfo
    )
  end)

end)


describe('hb.hsData.getScreenInfoById', function()

  it('should return an empty object if there are zero screens', function()
    local l = {}

    l.mockScreens = {}
    assert.are.same(
      {},
      hb.hsData.getScreenInfoById(l.mockScreens)
    )
  end)

  it('should return a proper object for one screen', function()
    local l = {}

    l.mockScreens = {
      {
        id = function() return 'Screen ID' end,
        name = function() return 'Screen Name' end,
        frame = function() return {
          x = 1,
          y = 2,
          w = 3,
          h = 4,
        } end,
      },
    }

    l.expectedValue = {}
    l.expectedValue['Screen ID'] = {
      id = 'Screen ID',
      name = 'Screen Name',
      x = 1,
      y = 2,
      width = 3,
      height = 4,
    }

    assert.are.same(
      l.expectedValue,
      hb.hsData.getScreenInfoById(l.mockScreens)
    )
  end)

  it('should return proper objects for multiple screens', function()
    local l = {}

    l.mockScreens = {
      {
        id = function() return 'Screen ID1' end,
        name = function() return 'Screen Name1' end,
        frame = function() return {
          x = 1,
          y = 2,
          w = 3,
          h = 4,
        } end,
      },
      {
        id = function() return 'Screen ID2' end,
        name = function() return 'Screen Name2' end,
        frame = function() return {
          x = 10,
          y = 20,
          w = 30,
          h = 40,
        } end,
      },
    }

    l.expectedValue = {}
    l.expectedValue['Screen ID1'] = {
      id = 'Screen ID1',
      name = 'Screen Name1',
      x = 1,
      y = 2,
      width = 3,
      height = 4,
    }
    l.expectedValue['Screen ID2'] = {
      id = 'Screen ID2',
      name = 'Screen Name2',
      x = 10,
      y = 20,
      width = 30,
      height = 40,
    }

    assert.are.same(
      l.expectedValue,
      hb.hsData.getScreenInfoById(l.mockScreens)
    )
  end)

end)

describe('hb.hsData.getWindowInfo', function()

  it('should return the proper fields for a hammerspoon window', function()
    local l = {}

    l.mockWindow = getMockHammerspoonWindow({
      applicationName = 'App Name',
      id = 'Window ID',
      isMinimized = true,
      isStandard = true,
      screenId = 'Screen ID',
      title = 'Window Title',
    })

    assert.are.same(
      {
        appName = 'App Name',
        id = 'Window ID',
        isMinimized = true,
        isStandard = true,
        screenId = 'Screen ID',
        windowTitle = 'Window Title',
      },
      hb.hsData.getWindowInfo(l.mockWindow)
    )
  end)

end)

describe('hb.hsData.getWindowInfoByWindowId', function()

  it('should return an empty object if there are zero windows', function()
    local l = {}

    l.mockWindows = {}
    assert.are.same(
      {},
      hb.hsData.getWindowInfoByWindowId(l.mockWindows)
    )
  end)

  it('should return a proper object for one window', function()
    local l = {}

    l.mockWindows = {
      getMockHammerspoonWindow({
        applicationName = 'App Name',
        id = 'Window ID',
        isMinimized = true,
        isStandard = true,
        screenId = 'Screen ID',
        title = 'Window Title',
      }),
    }

    l.expectedValue = {}
    l.expectedValue['Window ID'] = {
      appName = 'App Name',
      id = 'Window ID',
      isMinimized = true,
      isStandard = true,
      screenId = 'Screen ID',
      windowTitle = 'Window Title',
    }

    assert.are.same(
      l.expectedValue,
      hb.hsData.getWindowInfoByWindowId(l.mockWindows)
    )
  end)

  it('should return proper objects for multiple windows', function()
    local l = {}

    l.mockWindows = {
      getMockHammerspoonWindow({
        applicationName = 'App Name1',
        id = 'Window ID1',
        isMinimized = true,
        isStandard = true,
        screenId = 'Screen ID1',
        title = 'Window Title1',
      }),
      getMockHammerspoonWindow({
        applicationName = 'App Name2',
        id = 'Window ID2',
        isMinimized = false,
        isStandard = false,
        screenId = 'Screen ID2',
        title = 'Window Title2',
      }),
    }

    l.expectedValue = {}

    l.expectedValue['Window ID1'] = {
      appName = 'App Name1',
      id = 'Window ID1',
      isMinimized = true,
      isStandard = true,
      screenId = 'Screen ID1',
      windowTitle = 'Window Title1',
    }

    l.expectedValue['Window ID2'] = {
      appName = 'App Name2',
      id = 'Window ID2',
      isMinimized = false,
      isStandard = false,
      screenId = 'Screen ID2',
      windowTitle = 'Window Title2',
    }

    assert.are.same(
      l.expectedValue,
      hb.hsData.getWindowInfoByWindowId(l.mockWindows)
    )
  end)

end)

--------------------------------------------------------------------------------
-- hb.hsData tests
--------------------------------------------------------------------------------

describe('hb.info.getWindowInfoByAppName', function()

  it('should return an empty object if there are zero windows', function()
    local l = {}

    l.mockWindowInfoObjects = {}
    assert.are.same(
      {},
      hb.info.getWindowInfoByAppName(l.mockWindowInfoObjects)
    )
  end)

  it('should return a proper object when there is one window', function()
    local l = {}

    l.mockWindowInfoObjects = {
      {
        appName = 'App Name',
        id = 'Window ID',
        isMinimized = true,
        screenId = 'Screen ID',
        windowTitle = 'Window Title',
      }
    }

    l.expectedValue = {}
    l.expectedValue['App Name'] = {
      [1] = {
        appName = 'App Name',
        id = 'Window ID',
        isMinimized = true,
        screenId = 'Screen ID',
        windowTitle = 'Window Title',
      }
    }

    assert.are.same(
      l.expectedValue,
      hb.info.getWindowInfoByAppName(l.mockWindowInfoObjects)
    )
  end)

  it('should return proper objects when there are multiple windows of different apps', function()
    local l = {}

    l.mockWindowInfoObjects = {
      {
        appName = 'App Name1',
        id = 'Window ID1',
        isMinimized = true,
        screenId = 'Screen ID1',
        windowTitle = 'Window Title1',
      },
      {
        appName = 'App Name2',
        id = 'Window ID2',
        isMinimized = true,
        screenId = 'Screen ID2',
        windowTitle = 'Window Title2',
      },
    }

    l.expectedValue = {}
    l.expectedValue['App Name1'] = {
      [1] = {
        appName = 'App Name1',
        id = 'Window ID1',
        isMinimized = true,
        screenId = 'Screen ID1',
        windowTitle = 'Window Title1',
      }
    }
    l.expectedValue['App Name2'] = {
      [1] = {
        appName = 'App Name2',
        id = 'Window ID2',
        isMinimized = true,
        screenId = 'Screen ID2',
        windowTitle = 'Window Title2',
      },
    }

    assert.are.same(
      l.expectedValue,
      hb.info.getWindowInfoByAppName(l.mockWindowInfoObjects)
    )
  end)

  it('should return proper objects when there are multiple windows of the same app', function()
    local l = {}

    l.mockWindowInfoObjects = {
      {
        appName = 'App Name',
        id = 'Window ID1',
        isMinimized = true,
        screenId = 'Screen ID1',
        windowTitle = 'Window Title1',
      },
      {
        appName = 'App Name',
        id = 'Window ID2',
        isMinimized = true,
        screenId = 'Screen ID2',
        windowTitle = 'Window Title2',
      },
    }

    l.expectedValue = {}
    l.expectedValue['App Name'] = {
      [1] = {
        appName = 'App Name',
        id = 'Window ID1',
        isMinimized = true,
        screenId = 'Screen ID1',
        windowTitle = 'Window Title1',
      },
      [2] = {
        appName = 'App Name',
        id = 'Window ID2',
        isMinimized = true,
        screenId = 'Screen ID2',
        windowTitle = 'Window Title2',
      },
    }

    assert.are.same(
      l.expectedValue,
      hb.info.getWindowInfoByAppName(l.mockWindowInfoObjects)
    )
  end)

end)
