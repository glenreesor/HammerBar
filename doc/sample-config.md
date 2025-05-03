# Sample Complete Configuration

Here's a sample `~/hammerspoon/init.lua` that ties it all together with a decent
configuration to start from.

```lua
hs.loadSpoon("HammerBar")

-- Define widgets we want to add
local appMenu = spoon.HammerBar.widgets:appMenu({
    appList = {
      { bundleId = 'com.apple.Terminal', label = 'Term' },
      { bundleId = 'com.apple.TextEdit', label = 'Editor' },
      { bundleId = 'com.apple.calculator', label = 'Calculator' },
      { bundleId = 'com.apple.systempreferences', label = 'Sys Prefs' },
    },
});

local launchpadLauncher = spoon.HammerBar.widgets:appLauncher('com.apple.launchpad.launcher');
local finderLauncher = spoon.HammerBar.widgets:appLauncher('com.apple.finder');
local safariLauncher = spoon.HammerBar.widgets:appLauncher('com.apple.Safari');
local clock = spoon.HammerBar.widgets.clock();

local xeyes = spoon.HammerBar.widgets:xeyes({
  minInterval = 0.1,
  maxInterval = 3,
});

local cpuGraph = spoon.HammerBar.widgets:cpuMonitor({
  type = 'graph',
  interval = 1,
  maxValues = 100,
});

-- Add widgets to the left side of the primary screen
spoon.HammerBar:addWidgetsPrimaryScreenLeft({
    appMenu,
    launchpadLauncher,
    finderLauncher,
    safariLauncher,
})

-- Add widgets to the right side of the primary screen
spoon.HammerBar:addWidgetsPrimaryScreenRight({
    clock,
    xeyes,
    cpuGraph,
});

-- No widgets on secondary screens except a clock on the right side
spoon.HammerBar:addWidgetsSecondaryScreenRight({ clock });

spoon.HammerBar:start()
```
