# Sample Complete Configuration

Here's a sample `~/hammerspoon/init.lua` that ties it all together with a decent
configuration to start from.

```lua
hs.loadSpoon("HammerBar")

-- Return the number of seconds past current minute
function getSecondsAfterMinute()
  local handle = io.popen('date "+%S"')
  local result = handle:read('*a')
  handle:close()

  return result
end

-- Get the total CPU usage as a percent
function getCpuUsage()
  local handle = io.popen('top -l 1')
  local result = handle:read('*a')
  handle:close()

  local user, sys = result:match('CPU usage: (%d+%.%d+)%% user, (%d+%.%d+)%% sys')
  local totalUsage = tonumber(user) + tonumber(sys)

  return totalUsage
end

-- Add widgets to the left side of the primary screen
spoon.HammerBar:addWidgetsPrimaryScreenLeft({
    spoon.HammerBar.widgets:appMenu({
        appList = {
          { bundleId = 'com.apple.clock', label = 'Clock' },
          { bundleId = 'com.apple.calculator', label = 'Calculator' },
          { bundleId = 'com.apple.iCal', label = 'Calendar' },
        },
    }),
    spoon.HammerBar.widgets:appLauncher('com.apple.Safari'),
    spoon.HammerBar.widgets:appLauncher('com.apple.finder'),
    spoon.HammerBar.widgets:appLauncher('com.apple.launchpad.launcher'),
})

-- Add widgets to the right side of the primary screen
spoon.HammerBar:addWidgetsPrimaryScreenRight({
    spoon.HammerBar.widgets.clock(),
    spoon.HammerBar.widgets:xeyes({
        minInterval = 0.1,
        maxInterval = 3,
    }),
    spoon.HammerBar.widgets:lineGraph({
        title = 'CPU',
        interval = 1,
        maxValues = 100,
        cmd = getCpuUsage,
    }),
    spoon.HammerBar.widgets:text({
        title = 'CPU',
        interval = 1,
        cmd = function() return getCpuUsage() .. '%' end,
    }),
    spoon.HammerBar.widgets:text({
        title = 'Seconds',
        interval = 1,
        cmd = getSecondsAfterMinute,
    }),
})

-- No widgets on secondary screens except a clock on the right side
spoon.HammerBar:addWidgetsSecondaryScreenRight({
    spoon.HammerBar.widgets.clock(),
})

spoon.HammerBar:start()
```
