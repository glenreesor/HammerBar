-- Object to hold:
--  - public interface for HammerBar (start, stop, etc)
--  - testable functions so we can, you know, test them
local hb = {
  actions = {},
  canvas = {},
  desktops = {},
  display = {},
  hsData = {},
  info = {},
  main = {},
  util = {},
}

-- Object to hold global state without polluting global namespace
local lf = {}

lf.config = {
  fontSize = 13,
  defaultColors = {
    taskbar = { red = 180/255, green = 180/255, blue = 180/255 },
    icons   = { red = 132/255, green = 132/255, blue = 130/255 },
  },
  userColors = {
    -- taskbar = { rgb },
    -- icons   = { rgb },
    -- },
    -- appGroups = {
    --   groupName1 = { rgb },
    --   groupName2 = { rgb },
    -- },
    -- appNames = {
    --   appName1 = { rgb } | 'groupNameN',
    --   appName2 = { rgb } | 'groupNameN',
    -- }
  },
  userAppNamesAndWindowTitles = {
    -- {
    --  appName = 'Native App Name',
    --  windowTitle = 'Native Window Title',            nil == Match any title
    --  displayAppName = 'App Name to Display',         nil == use existing appName
    --  displayWindowTitle = 'Window Title to Display', nil == use existing windowTitle
    -- },
  },
}

lf.WHITE = { red = 1.0, green = 1.0, blue = 1.0 }
lf.BLACK = { red = 0.0, green = 0.0, blue = 0.0 }

lf.CANVAS_HEIGHT = lf.config.fontSize * 2 + 14
lf.BUTTON_WIDTH = 130
lf.DESKTOP_SWITCHER_WIDTH = 70
lf.BUTTON_HEIGHT = lf.config.fontSize * 2 + 8
lf.BUTTON_PADDING = 5
lf.HEARTBEAT_WIDTH = 20

--------------------------------------------------------------------------------
-- Functions for dealing with clicks on the taskbar
--------------------------------------------------------------------------------

function hb.actions.onTaskbarClick(canvas, message, elementInfo)
  local l = {}

  l.type = string.gsub(elementInfo, ' .*', '')
  l.id = string.gsub(elementInfo, '^.* ', '')

  if (l.type == "heartbeat") then
    hb.actions.processHeartbeatClick()

  elseif (l.type == "windowButton") then
    hb.actions.processWindowButtonClick(tonumber(l.id))

  elseif (l.type == "desktopSwitcher") then
    hb.actions.processDesktopSwitcherClick(tonumber(l.id))
  end
end

function hb.actions.processDesktopSwitcherClick(desktopId)
  hb.desktops.switchToDesktop(desktopId)
end


function hb.actions.processHeartbeatClick()
  hs.reload()
end


function hb.actions.processWindowButtonClick(id)
  local l = {}

  l.hsWindow = hs.window.get(id)

  -- `hsWindow` might be nil if the window was closed after the most
  -- recent taskbar update
  if (l.hsWindow == nil) then
    return
  end

  l.toggleAllDesktops = hs.eventtap.checkKeyboardModifiers().shift

  if (l.toggleAllDesktops) then
    hb.desktops.toggleWindowAllDesktops(l.hsWindow)
    return
  end


  if l.hsWindow:isMinimized() then
    l.hsWindow:unminimize()
  else
    l.hsWindow:minimize()
  end

  hb.main.updateAllTaskbars()
end

--------------------------------------------------------------------------------
-- Functions involving a canvas
--------------------------------------------------------------------------------

function hb.canvas.getDesktopSwitcherElements(switcherId, isCurrent, x, y)
  local l = {}

  l.fontSize = lf.config.fontSize

  if (isCurrent) then
    l.textColor = lf.BLACK
    l.strokeWidth = 2
  else
    l.textColor = { red = 100/255, green = 100/255, blue = 100/255 }
    l.strokeWidth = 1
  end

  l.canvasElements = {
    {
      type = 'rectangle',
      fillColor = lf.WHITE,
      frame = { x = x, y = y, w = lf.DESKTOP_SWITCHER_WIDTH, h = l.fontSize * 2 },
      strokeWidth = l.strokeWidth,
      trackMouseUp = true,
      id = 'desktopSwitcher ' .. tostring(switcherId),
    },
    {
      type = 'text',
      text = 'Desktop ' .. tostring(switcherId),
      textColor = l.textColor,
      textSize = l.fontSize,
      frame = {
        x = x + 3,
        y = y,
        w = lf.DESKTOP_SWITCHER_WIDTH - 4,
        h = l.fontSize * 2,
      },
      trackMouseUp = true,
      id = 'desktopSwitcher ' .. tostring(switcherId),
    },
  }

  -- Add dots for each window on this desktop
  l.x = x + 4
  l.y = y + l.fontSize + 5

  for i = 1, #(lf.state.windowIdsByDesktopId[switcherId]) do
    table.insert(l.canvasElements, {
      type = 'rectangle',
      fillColor = l.textColor,
      strokeColor = l.textColor,
      frame = { x = l.x, y = l.y, w = 2, h = 2 },
      strokeWidth = 1,
    })

    l.x = l.x + 5
    if (l.x + 2 > x + lf.DESKTOP_SWITCHER_WIDTH) then
      l.x = x + 4
      l.y = l.y + 4
    end
  end

  return l.canvasElements
end


function hb.canvas.getHeartbeatElements(x, y, showInnerBeat)
  local l = {}

  outerColor = { red = 0/255, green = 0/255, blue = 250/255 }
  innerColor = { red = 0/255, green = 0/255, blue = 100/255 }

  centerX = x + lf.HEARTBEAT_WIDTH / 2
  centerY = y

  l.canvasElements = {
    {
      type = 'circle',
      radius = lf.HEARTBEAT_WIDTH / 2,
      center = {
        x = centerX,
        y = centerY,
      },
      fillColor = outerColor,
      strokeColor = outerColor,
      trackMouseUp = true,
      id = 'heartbeat junk',
    }
  }

  if (showInnerBeat) then
    table.insert(l.canvasElements, {
      type = 'circle',
      radius = lf.HEARTBEAT_WIDTH / 4,
      center = {
        x = centerX,
        y = centerY,
      },
      fillColor = innerColor,
      strokeColor = innerColor,
      trackMouseUp = true,
      id = 'heartbeat junk',
    })
  end

  return l.canvasElements
end


function hb.canvas.getTaskbarElements(width, height)

  return {
    type = 'rectangle',
    fillColor = hb.display.getTaskbarColor(),
    frame = { x = 0, y = 0, w = width, h = height},
  }
end


function hb.canvas.getWindowButtonElements(x, y, window)
  local l = {}

  l.ICON_WIDTH = 15
  l.ICON_PADDING_LEFT = 4
  l.TEXT_PADDING_LEFT = 3
  l.VERTICAL_PADDING = 2

  l.MAX_TEXT_WIDTH = (
    lf.BUTTON_WIDTH -
    l.ICON_WIDTH -
    l.ICON_PADDING_LEFT -
    l.TEXT_PADDING_LEFT -
    4
  )

  l.iconX = x + l.ICON_PADDING_LEFT
  l.textX = l.iconX + l.ICON_WIDTH + l.TEXT_PADDING_LEFT
  l.textLine1Y = y
  l.textLine2Y = l.textLine1Y + lf.config.fontSize + l.VERTICAL_PADDING

  if (window.isMinimized) then
    l.iconHeight = lf.config.fontSize - 1
    l.iconY = y + lf.config.fontSize + l.VERTICAL_PADDING * 2
  else
    l.iconHeight = lf.config.fontSize * 2 - 1
    l.iconY = y + 4
  end

  l.allDesktopsIndicatorX = l.iconX + 2
  l.allDesktopsIndicatorY = l.iconY + l.iconHeight + 2

  l.iconColor = hb.display.getWindowIconColor(window)

  l.displayInfo = hb.display.getAppNameAndWindowTitle(window)
  l.appNameToDisplay = l.displayInfo.appName
  l.windowTitleToDisplay = l.displayInfo.windowTitle

  l.clickId = 'windowButton ' .. window.id

  l.canvasElements = {
    {
      -- Container
      type = 'rectangle',
      fillColor = lf.WHITE,
      frame = {
        x = x,
        y = y,
        w = lf.BUTTON_WIDTH,
        h = lf.BUTTON_HEIGHT,
      },
      roundedRectRadii = { xRadius = 5.0, yRadius = 5.0 },
      trackMouseUp = true,
      id = l.clickId,
    }, {
      -- Icon
      type = 'rectangle',
      fillColor = l.iconColor,
      frame = { x = l.iconX, y = l.iconY, w = l.ICON_WIDTH, h = l.iconHeight },
      roundedRectRadii = { xRadius = 6.0, yRadius = 6.0 },
      trackMouseUp = true,
      id = l.clickId,
    }, {
      -- Text: window title
      type = 'text',
      text = l.windowTitleToDisplay,
      textColor = lf.BLACK,
      textSize = lf.config.fontSize,
      textLineBreak = 'clip',
      frame = {
        x = l.textX,
        y = l.textLine1Y,
        w = l.MAX_TEXT_WIDTH,
        h = lf.config.fontSize + 8,
      },
      trackMouseUp = true,
      id = l.clickId,
    }, {
      -- Text: App Name
      type = 'text',
      text = l.appNameToDisplay,
      textColor = lf.BLACK,
      textSize = lf.config.fontSize,
      textLineBreak = 'clip',
      frame = {
        x = l.textX,
        y = l.textLine2Y,
        w = l.MAX_TEXT_WIDTH,
        h = lf.config.fontSize + 8,
      },
      trackMouseUp = true,
      id = l.clickId,
    }
  }

  -- Hack for now to make it easy to quickly see which windows aren't "standard"
  if (not window.isStandard) then
    table.insert(l.canvasElements, {
      type = 'rectangle',
      fillColor = lf.BLACK,
      strokeColor = lf.BLACK,
      frame = {
        x = l.iconX + l.ICON_WIDTH / 2,
        y = l.iconY,
        w = 1,
        h = l.iconHeight,
      }
    })
  end

  -- All desktops indicator
  if (hb.desktops.windowIsInAllDesktops(window.id)) then
    table.insert(l.canvasElements, {
      type = 'rectangle',
      fillColor = lf.BLACK,
      strokeColor = lf.BLACK,
      frame = {
        x = l.allDesktopsIndicatorX,
        y = l.allDesktopsIndicatorY,
        w = l.ICON_WIDTH - 4,
        h = 1,
      }
    })
  end

  return l.canvasElements
end


-- Update lf.state.canvasesByScreenId:
--   - ensure each present screen has a canvas
--   - ensure there are no canvases without a corresponding screen
function hb.canvas.updateCanvasesByScreenId(screenInfoById)
  local l = {}

  -- Ensure all required canvases exist
  for _, screenInfo in pairs(screenInfoById) do
    if (lf.state.canvasesByScreenId[screenInfo.id] == nil) then
      l.newCanvas = hs.canvas.new(
        {
          x = screenInfo.x,
          y = screenInfo.y + screenInfo.height - lf.CANVAS_HEIGHT,
          w = screenInfo.width,
          h = lf.CANVAS_HEIGHT,
        }
      )
      l.newCanvas:show()
      lf.state.canvasesByScreenId[screenInfo.id] = l.newCanvas
      l.newCanvas:mouseCallback(hb.actions.onTaskbarClick)
    end
  end

  -- Remove stale canvases
  for screenId, canvas in pairs(lf.state.canvasesByScreenId) do
    if (screenInfoById[screenId] == nil) then
      if (canvas.delete ~= nil) then
        canvas:delete()
        lf.state.canvasesByScreenId[screenId] = nil
      end
    end
  end
end

--------------------------------------------------------------------------------
-- Functions for dealing with virtual desktops
--------------------------------------------------------------------------------

function hb.desktops.hideHammerspoonWindows(windowIds)
  local l = {}

  -- Move all the specified windows to the bottom right corner so they're not
  -- visible
  for _, windowId in pairs(windowIds) do
    l.hsWindow = hs.window.get(windowId)

    -- We have to check for nil hsWindow here because we're operating on a list
    -- of window ids that may not reflect the currently active windows
    if (l.hsWindow ~= nil) then
      l.window = hb.hsData.getWindow(l.hsWindow)

      if (hb.desktops.shouldManageWindow(l.window)) then
        lf.state.previousWindowTopLeftByWindowId[
          l.window.id
        ] = l.hsWindow:topLeft()
        l.hsWindow:setTopLeft({x = 10000, y = 100000})
      end
    end
  end

end


function hb.desktops.shouldManageWindow(window)
  -- Only manage:
  --  - windows that aren't on all desktops
  --  - standard windows since I haven't figured out if some non-standard
  --    ones don't behave well or if I was messing up
  --  - unminimized windows since minimized ones already aren't visible

  return (
    not hb.desktops.windowIsInAllDesktops(window.id) and
    window.isStandard and
    not window.isMinimized
  )
end


function hb.desktops.switchToDesktop(targetDesktopId)
  local l = {}

  hb.desktops.hideHammerspoonWindows(
    lf.state.windowIdsByDesktopId[lf.state.currentDesktopId]
  )

  hb.desktops.unhideHammerspoonWindows(
    lf.state.windowIdsByDesktopId[targetDesktopId]
  )

  lf.state.currentDesktopId = targetDesktopId
end


function hb.desktops.toggleWindowAllDesktops(hammerspoonWindow)
  local l = {}

  l.window = hb.hsData.getWindow(hammerspoonWindow)

  if (hb.desktops.windowIsInAllDesktops(l.window.id)) then
    -- Remove from all desktops then re-add to only the current one
    for _, desktopId in pairs( {1, 2} ) do
      l.index = hs.fnutils.indexOf(
        lf.state.windowIdsByDesktopId[desktopId],
        l.window.id
      )
      table.remove(lf.state.windowIdsByDesktopId[desktopId], l.index)
    end

    table.insert(
      lf.state.windowIdsByDesktopId[lf.state.currentDesktopId],
      l.window.id
    )
  else
    -- Ensure present on all desktops
    for _, desktopId in pairs( { 1, 2 } ) do
      if (
        not hb.util.contains(
          lf.state.windowIdsByDesktopId[desktopId],
          l.window.id
        )
      ) then
        table.insert(lf.state.windowIdsByDesktopId[desktopId], l.window.id)
      end
    end
  end
end


function hb.desktops.unhideHammerspoonWindows(windowIds)
  local l = {}

  for _, windowId in pairs(windowIds) do
    l.hsWindow = hs.window.get(windowId)

    -- We have to check for nil hsWindow here because we're operating on a list
    -- of window ids that may not reflect the currently active windows
    if (l.hsWindow ~= nil) then
      l.window = hb.hsData.getWindow(l.hsWindow)

      if (hb.desktops.shouldManageWindow(l.window)) then
        l.hsWindow:setTopLeft(
          lf.state.previousWindowTopLeftByWindowId[l.window.id]
        )
      end
    end
  end
end


function hb.desktops.updateWindowIdsByDesktopId(
  currentDesktopId,
  allWindowsById
)
  local l = {}

  -- Any windows not assigned to a virtual desktop must belong to the current one
  for windowId, window in pairs(allWindowsById) do
    if (
      not hb.util.contains(lf.state.windowIdsByDesktopId[1], windowId) and
      not hb.util.contains(lf.state.windowIdsByDesktopId[2], windowId)
    ) then
      table.insert(lf.state.windowIdsByDesktopId[currentDesktopId], windowId)
    end
  end

  -- Any windows assigned to a virtual desktop that aren't in our window list
  -- must have been closed since our last update
  for _, desktopId in pairs({ 1, 2 }) do
    for _, windowId in pairs(lf.state.windowIdsByDesktopId[desktopId]) do
      if (allWindowsById[windowId] == nil) then
        l.index = hb.util.indexOf(lf.state.windowIdsByDesktopId[desktopId], windowId)
        table.remove(lf.state.windowIdsByDesktopId[desktopId], l.index)
      end
    end
  end
end


function hb.desktops.windowIsInAllDesktops(windowId)
  return (
    hb.util.contains(lf.state.windowIdsByDesktopId[1], windowId) and
    hb.util.contains(lf.state.windowIdsByDesktopId[2], windowId)
  )
end

--------------------------------------------------------------------------------
-- Functions for determining what to display
--------------------------------------------------------------------------------

-- Return an object that indicates what appName and windowTitle to display for
-- the specified window
--
-- Return value is of the form:
-- {
--   appName = 'Something to display'
--   windowTitle = 'Something else to display'
-- }
function hb.display.getAppNameAndWindowTitle(window)
  local l = {}

  l.userConfig = lf.config.userAppNamesAndWindowTitles

  l.returnValue = {
    appName = window.appName,
    windowTitle = window.windowTitle
  }

  for _, userConfig in pairs(l.userConfig) do
    if (
      userConfig.appName == window.appName and
      (
        userConfig.windowTitle == window.windowTitle or
        userConfig.windowTitle == nil
      )
    ) then
      if (userConfig.displayAppName ~= nil) then
        l.returnValue.appName = userConfig.displayAppName
      end

      if (userConfig.displayWindowTitle ~= nil) then
        l.returnValue.windowTitle = userConfig.displayWindowTitle
      end

      break
    end
  end

  return l.returnValue
end


function hb.display.getDefaultColors()
  return lf.config.defaultColors
end


function hb.display.getTaskbarColor()
  if (lf.config.userColors.taskbar ~= nil) then
    return lf.config.userColors.taskbar
  else
    return lf.config.defaultColors.taskbar
  end
end


function hb.display.getWindowIconColor(window)
  local l = {}


  if (
    lf.config.userColors.appNames == nil or
    lf.config.userColors.appNames[window.appName] == nil
  ) then
    return lf.config.defaultColors.icons
  end

  l.userColor = lf.config.userColors.appNames[window.appName]

  if (type(l.userColor) == 'table') then
    return l.userColor
  else
    return lf.config.userColors.appGroups[l.userColor]
  end
end

function hb.display.resetUserConfig()
  lf.config.userColors = {}
  lf.config.userAppNamesAndWindowTitles = {}
end

--------------------------------------------------------------------------------
-- Functions for Processing Hammerspoon Tables
--------------------------------------------------------------------------------

-- Return a table with the following fields corresponding to the passed-in
-- hammerspoon screen object
--
--  id     - string
--  name   - string
--  x      - number
--  y      - number
--  width  - number
--  height - number
--
function hb.hsData.getScreenInfo(hammerspoonScreen)
  local l = {}
  local screenInfo = {}

  screenInfo.id = hammerspoonScreen:id()
  screenInfo.name = hammerspoonScreen:name()

  -- VNC Server doesn't have a name
  if (screenInfo.name == nil) then
    screenInfo.name = 'Unknown'
  end

  l.frame = hammerspoonScreen:frame()

  screenInfo.x = l.frame.x
  screenInfo.y = l.frame.y
  screenInfo.width = l.frame.w
  screenInfo.height = l.frame.h

  return screenInfo
end

-- Return a table keyed by screen ID, where each of those values
-- is a table as returned by getScreenInfo(), corresponding to the
-- passed-in table of hammerspoon screens
--
--  {
--    'id1' = {
--      ... fields returned by getScreenInfo()
--    },
--    'id2' = {
--      ... fields returned by getScreenInfo()
--    },
--  }
function hb.hsData.getScreenInfoById(hammerspoonScreens)
  local l = {}
  local screenInfoById = {}

  for _, screen in pairs(hammerspoonScreens) do
    l.screenInfo = hb.hsData.getScreenInfo(screen)
    screenInfoById[l.screenInfo.id] = l.screenInfo
  end

  return screenInfoById
end

-- Return a table with the following fields corresponding to the passed-in
-- hammerspoon window object
--
--  appName     - string
--  id          - string
--  isMinimized - boolean
--  isStandard  - boolean
--  screenId    - string
--  windowTitle - string
--
function hb.hsData.getWindow(hsWindow)
  local l = {}
  local window = {}

  l.application = hsWindow:application()
  if (l.application == nil) then
    -- Not sure what these windows are
    window.appName = 'Unknown'
  else
    window.appName = l.application:name()
  end

  window.id = hsWindow:id()
  window.isMinimized = hsWindow:isMinimized()
  window.isStandard = hsWindow:isStandard()
  window.screenId = hsWindow:screen():id()
  window.windowTitle = hsWindow:title()

  return window
end


function hb.hsData.getWindowsByWindowId(hammerSpoonWindows)
  local l = {}
  local windowsByWindowId = {}

  for _, hammerSpoonWindow in pairs(hammerSpoonWindows) do
    l.window = hb.hsData.getWindow(hammerSpoonWindow)
    windowsByWindowId[l.window.id] = l.window
  end

  return windowsByWindowId
end

--------------------------------------------------------------------------------
-- Functions for processing our window objects
--------------------------------------------------------------------------------

-- Return a table of window IDs keyed by app name, corresponding to
-- the passed-in table of window objects
--
-- {
--  "App Name 1" = { windowId1, windowId2, ...},
--  "App Name 2" = { windowId1, windowId2, ...},
-- }
function hb.info.getWindowIdsByAppName(windows)
  local windowIdsByAppName = {}

  for _, window in pairs(windows) do
    if (windowIdsByAppName[window.appName] == nil) then
      windowIdsByAppName[window.appName] = {}
    end

    table.insert(windowIdsByAppName[window.appName], window.id)
  end

  return windowIdsByAppName
end


--------------------------------------------------------------------------------
-- The main Hammerbar functions
--------------------------------------------------------------------------------

function hb.main.initState()
  lf.state = {}

  lf.state.canvasesByScreenId = {}

  lf.state.currentDesktopId = 1
  lf.state.windowIdsByDesktopId = { {}, {} }

  lf.state.previousWindowTopLeftByWindowId = {}

  lf.state.lastHeartInnerBeatTime = 0
end


function hb.main.recoverPreviouslyHiddenWindows()
  local l = {}

  -- If user restarted Hammerbar, there may be windows that were moved to
  -- the bottom right. Bring those back

  l.x = 0
  l.y = 30

  l.allHsWindows = hs.window.allWindows()
  l.notificationShown = false
  for _, hsWindow in pairs(l.allHsWindows) do
    l.windowX = hsWindow:frame().x
    l.windowY = hsWindow:frame().y

    if (l.windowX > 900 and l.windowY > 900) then
      if (not l.notificationShown) then
        l.notificationShown = true
        hs.notify.show(
          'Recovering previously hidden windows. See hammerspoon console',
          '',
          ''
        )
        print('Recovering previously hidden windows')
      end

      l.window = hb.hsData.getWindow(hsWindow)
      l.infoToPrint = l.window.appName ..
        '(' .. l.window.windowTitle .. ')' ..
        '    ' ..
        '(' .. tostring(l.windowX) .. ', ' .. tostring(l.windowY) .. ')'

      print('  ' .. l.infoToPrint)

      hsWindow:setTopLeft({ x = l.x, y = l.y })
      hsWindow:raise()
      l.x = l.x + 30
      l.y = l.y + 30
    end
  end
end


-- Update taskbars for all screens
function hb.main.updateAllTaskbars()
  local l = {}

  -- Use the absence of any Hammerspoon windows (e.g. the taskbar canvases)
  -- as a proxy for screen lock, screen saver, etc.
  -- In these states, there are no windows reported by Hammerspoon and thus our
  -- logic for tracking which window is on each desktop will be working with
  -- invalid data.
  l.hammerspoonWindowFound = false
  l.allWindowsById = hb.hsData.getWindowsByWindowId(hs.window.allWindows())

  for _, window in pairs(l.allWindowsById) do
    if (window.appName == 'Hammerspoon') then
      l.hammerspoonWindowFound = true
      break
    end
  end

  -- Don't forget special case of first run, which we detect by the fact there
  -- are no taskbar canvases yet
  if (
    #(hb.util.keys(lf.state.canvasesByScreenId)) > 0 and
    not l.hammerspoonWindowFound
  ) then
    print('Hammerbar: No Hammerspoon windows. Skipping taskbar updates.')
    return
  end

  ------------------------------------------------------------------------------
  -- Update things that may have changed since our last call:
  --  - screens may have been added or removed
  --  - windows may have been created or destroyed (and thus we need to update
  --    our list of windows on each desktop)
  ------------------------------------------------------------------------------
  l.screenInfoById = hb.hsData.getScreenInfoById(hs.screen.allScreens())
  hb.canvas.updateCanvasesByScreenId(l.screenInfoById)

  hb.desktops.updateWindowIdsByDesktopId(
    lf.state.currentDesktopId,
    l.allWindowsById
  )

  ------------------------------------------------------------------------------
  -- Everything's up to date, so update the taskbar(s) with windows associated
  -- with the current desktop
  ------------------------------------------------------------------------------

  for screenId, screenInfo in pairs(l.screenInfoById) do

    l.windowsThisScreen = hb.util.filter(
      l.allWindowsById,
      function(window, windowId)
        if (
          hb.util.contains(
            lf.state.windowIdsByDesktopId[lf.state.currentDesktopId],
            windowId
          ) and
          window.screenId == screenId
        ) then
          return true
        else
          return false
        end
      end
    )

    hb.main.updateTaskbar(
      lf.state.canvasesByScreenId[screenInfo.id],
      { width = screenInfo.width, height = screenInfo.height },
      l.windowsThisScreen
    )
  end
end


-- Update the taskbar for the specified screen so it shows buttons for
-- each of the specified window objects
function hb.main.updateTaskbar(canvas, dimensions, windowsThisCanvasById)
  local l = {}

  l.DESKTOP_SWITCHERS_WIDTH = lf.DESKTOP_SWITCHER_WIDTH * 2 +
    lf.BUTTON_PADDING * 2

  -- Sort our window objects by windowId so the order on the taskbar is
  -- consistent from render to render

  table.sort(windowsThisCanvas, function(a, b) return a.id < b.id end)

  canvas:replaceElements(
    hb.canvas.getTaskbarElements(dimensions.width, dimensions.height)
  )

  l.x = lf.BUTTON_PADDING

  l.secondsSinceLastHeartInnerBeat = os.time() - lf.state.lastHeartInnerBeatTime
  if (l.secondsSinceLastHeartInnerBeat >= 2) then
    l.showBeat = true
    lf.state.lastHeartInnerBeatTime = os.time()
  end

  canvas:appendElements(
    hb.canvas.getHeartbeatElements(
      l.x,
      lf.CANVAS_HEIGHT / 2,
      l.showBeat
    )
  )
  lf.lastHeartbeatTimeSinceEpoch = os.time()

  l.x = l.x + lf.HEARTBEAT_WIDTH + lf.BUTTON_PADDING
  l.y = (lf.CANVAS_HEIGHT - lf.BUTTON_HEIGHT) / 2

  -- Use a sorted list of app names so order on the taskbar is consistent and
  -- windows don't jump around
  l.windowIdsByAppName = hb.info.getWindowIdsByAppName(windowsThisCanvas)
  l.appNames = hb.util.keys(l.windowIdsByAppName)
  table.sort(l.appNames)

  for _, appName in pairs(l.appNames) do
    -- Sort our windows by ID because the order returned by Hammerspoon is not
    -- consistent. Using a specific order ensures windows don't jump around on
    -- the taskbar
    l.windowIdsThisApp = l.windowIdsByAppName[appName]
    table.sort(l.windowIdsThisApp)

    for _, windowId in pairs(l.windowIdsThisApp) do
      l.window = windowsThisCanvas[windowId]
      canvas:appendElements(
        hb.canvas.getWindowButtonElements(l.x, l.y, l.window)
      )

      l.x = l.x + lf.BUTTON_WIDTH + lf.BUTTON_PADDING
      if (l.x + lf.BUTTON_WIDTH > dimensions.width - l.DESKTOP_SWITCHERS_WIDTH) then
        l.x = 0
        l.y = l.y + 15
      end
    end
  end

  l.x = dimensions.width - l.DESKTOP_SWITCHERS_WIDTH
  l.y = (lf.CANVAS_HEIGHT - lf.BUTTON_HEIGHT) / 2

  for _, desktopId in pairs({ 1, 2 }) do
    canvas:appendElements(hb.canvas.getDesktopSwitcherElements(
      desktopId,
      lf.state.currentDesktopId == desktopId,
      l.x,
      l.y
    ))

    l.x = l.x + lf.BUTTON_PADDING + lf.DESKTOP_SWITCHER_WIDTH
  end
end

--------------------------------------------------------------------------------
-- Utility functions
--------------------------------------------------------------------------------

-- Return whether needle is contained in the table haystack
-- Only a shallow comparison is done
function hb.util.contains(haystack, needle)
  local l = {}

  l.found = false
  for key, value in pairs(haystack) do
    if (value == needle) then
      l.found = true
      break
    end
  end

  return l.found
end


function hb.util.filter(table, filteringFunction)
  local filteredTable = {}

  for key, value in pairs(table) do
    if (filteringFunction(value, key)) then
      filteredTable[key] = value
    end
  end

  return filteredTable
end


-- Return the 1-based index of first occurrence of needle in the table haystack.
-- Return -1 if not found
-- Only a shallow comparison is done
function hb.util.indexOf(haystack, needle)
  local l = {}

  l.index = -1
  for index, value in ipairs(haystack) do
    if (value == needle) then
      l.index = index
      break
    end
  end

  return l.index
end


function hb.util.keys(srcTable)
  local keys = {}

  for key, _ in pairs(srcTable) do
    table.insert(keys, key)
  end

  return keys
end


--------------------------------------------------------------------------------
-- Public Interface
--------------------------------------------------------------------------------

function hb:setAppNamesAndWindowTitles(appNamesAndWindowTitles)
  lf.config.userAppNamesAndWindowTitles = appNamesAndWindowTitles
end

function hb:setColors(colors)
  lf.config.userColors = colors
end

function hb:start()
  hb.main.initState()
  hb.main.recoverPreviouslyHiddenWindows()
  hb.main.updateAllTaskbars()

  lf.state.doitTimer = hs.timer.doEvery(0.5, hb.main.updateAllTaskbars)
end

function hb:stop()
  lf.state.doitTimer:stop()
end

return hb
