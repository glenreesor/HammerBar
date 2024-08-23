# HammerBar - A Windows-Like Taskbar for MacOS

HammerBar is a "Spoon" for [HammerSpoon](https://www.hammerspoon.org) that displays
a clickable taskbar along the bottom of your screen with support for app launchers
and "widgets" that can show the output of arbitrary lua functions.

![HammerBar example](doc/example.png)

# Quick Start

- install [Hammerspoon](https://www.hammerspoon.org)
- create the directory `~/.hammerspoon/Spoons/HammerBar.spoon/`
- copy `appMenuButton.png` and `init.lua`
  from the [current release](https://github.com/glenreesor/HammerBar/releases/tag/v1.0)
  to `~/.hammerspoon/Spoons/HammerBar.spoon/`
- add the following lines to `~/.hammerspoon/init.lua`:

      hs.loadSpoon("HammerBar")
      spoon.HammerBar:start()

- set your Dock to autohide, otherwise the HammerBar taskbar will be _above_ the dock.
- restart Hammerspoon

You should now have a basic taskbar. Yay!

But of course there's more. Read on....

# Widgets, Screens and BundleIds

Other than the actual taskbar, all other functionality is provided by Widgets. Widgets
are explicitly added to the Primary screen and Secondary screens using the HammerBar
API.

For example, to add a Safari launcher to the left side of the primary screen and
a clock to the right side, change your `~/.hammerspoon/init.lua` to:

```lua
hs.loadSpoon("HammerBar")

spoon.HammerBar:addWidgetsPrimaryScreenLeft({
  spoon.HammerBar.widgets:appLauncher('com.apple.Safari'),
});

spoon.HammerBar:addWidgetsPrimaryScreenRight({
  spoon.HammerBar.widgets.clock(),
})

spoon.HammerBar:start()
```

Or perhaps you want the Safari launcher only on your primary screen but the clock
on all your screens:

```lua
hs.loadSpoon("HammerBar")

spoon.HammerBar:addWidgetsPrimaryScreenLeft({
  spoon.HammerBar.widgets:appLauncher('com.apple.Safari'),
});

spoon.HammerBar:addWidgetsPrimaryScreenRight({
  spoon.HammerBar.widgets.clock(),
})

spoon.HammerBar:addWidgetsSecondaryScreenRight({
  spoon.HammerBar.widgets.clock(),
})

spoon.HammerBar:start()
```

## BundleIds

What the heck are BundleIds? Those are strings used by MacOS to identify applications.
For example in the examples above we used the BundleId `com.apple.Safari`.

So you want to add a different application launcher, how do you determine its
BundleId? Easy. Make sure the Hammerspoon console is open (click the Hammerspoon
icon in the MacOS menu bar and select `Console...`), then launch your application
the normal MacOS way. After it starts, Shift + Click its button in the HammerBar taskbar to
get debug information, including the BundleId, printed to the Hammerspoon console.

# API

You've already seen most of the HammerBar API, but here it is in full:

## `addWidgetsPrimaryScreenLeft()`

Adds one or more widgets to the left side of the primary screen.

**Argument**

- A table containing calls to widgets

**Examples**

- Add a Safari launcher

        spoon.HammerBar:addWidgetsPrimaryScreenLeft({
          spoon.HammerBar.widgets:appLauncher('com.apple.Safari'),
        })

- Add a Safari launcher and a Finder launcher

        spoon.HammerBar:addWidgetsPrimaryScreenLeft({
          spoon.HammerBar.widgets:appLauncher('com.apple.Safari'),
          spoon.HammerBar.widgets:appLauncher('com.apple.finder'),
        })

## `addWidgetsPrimaryScreenRight()`

Adds one or more widgets to the right side of the primary screen.

**Argument**

- identical to `addWidgetsPrimaryScreenRight()`

## `addWidgetsSecondaryScreenLeft()`

Adds one or more widgets to the left side of all secondary screens.

**Argument**

- identical to `addWidgetsPrimaryScreenRight()`

## `addWidgetsSecondaryScreenRight()`

Adds one or more widgets to the right side of all secondary screens.

**Argument**

- identical to `addWidgetsPrimaryScreenRight()`

## `setWindowListUpdateInterval()`

Sets the polling frequency used to query Hammerspoon for the current list of
windows. This defaults to 3s which seems to work well, but setting a smaller
interval will result in new windows showing up on the taskbar sooner. There might
be a performance hit due to the increased polling (I haven't investigated this
potential performance hit).

**Argument**

- polling frequency in seconds

## `setWindowStatusUpdateInterval()`

Sets the polling frequency used to query each app present on the taskbar to
get it's current state (minimized or not and the window title). This defaults to 1s.

**Argument**

- polling frequency in seconds

## `start()`

Starts HammerBar.

**Argument**

- None

## `stop()`

Cleans up timers and canvases then stops Hammerbar.

**Argument**

- None

# Widgets

As seen above one or more widgets can be added using:

- `addWidgetsPrimaryScreenLeft()`
- `addWidgetsPrimaryScreenRight()`
- `addWidgetsSecondaryScreenLeft()`
- `addWidgetsSecondaryScreenRight()`

## App Launcher

Adds a launcher for the specified app.

**Argument**

- the bundle ID of the app to launch

**Example**

- Add a Chrome launcher

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:appLauncher('com.google.Chrome'),
          })

## App Menu

Adds a launcher button that shows a menu of the specified applications when clicked.

**Argument**

- A table containing the following keys:
  - `appList`: A table (list) of information for the apps to appear in the menu.
    Each element in the list is a table with the following keys
    - `bundleId`: A string that specifies the bundleId of the app to launch
    - `label`: A string with the label to show in the menu
  - `icon`: an optional table that specifies an icon to use for the launcher button.
    Contains one of the following keys:
    - `bundleId`: The bundleId of the app whose icon should be used
    - `imagePath`: The fully qualified path of an image to be used

**Examples**

- Add an app menu with buttons for Safari and the Finder

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:appMenu({
                appList = {
                  { bundleId = 'com.apple.Safari', label = 'Safari' },
                  { bundleId = 'com.apple.finder', label = 'Finder' },
                },
            }),
          })

- Add an app menu that uses the System Preferences icon for the launcher, with buttons for Safari and the Finder

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:appMenu({
                appList = {
                  { bundleId = 'com.apple.Safari', label = 'Safari' },
                  { bundleId = 'com.apple.finder', label = 'Finder' },
                },
                icon = { bundleId = 'com.apple.systempreferences' },
            }),
          })

- Add an app menu that uses the image at `~/myMenuButton.jpg` for the launcher, with buttons for Safari and the Finder

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:appMenu({
                appList = {
                  { bundleId = 'com.apple.Safari', label = 'Safari' },
                  { bundleId = 'com.apple.finder', label = 'Finder' },
                },
                icon = { imagePath = '~/myMenuButton.jpg' },
            }),
          })

## Clock

Adds a simple clock.

**Argument**

- None

**Example**

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:clock(),
          })

## Line Graph

Draws a line graph using numbers generated by a lua function you pass in.

**Argument**

- a table with the following keys:
  - `title`: A string to display above the graph
  - `interval`: The frequency at which to call the supplied command
  - `maxValues`: The maximum number of values to retain in the graph
  - `maxGraphValue`: The highest y-value to use for the graph. Dynamic if omitted
  - `cmd`: A lua function that returns a number

**Example**

- Draw a graph of CPU load and update it every second:

          function getCpuUsage()
            local handle = io.popen('ps -e -o %cpu')
            local result = handle:read('*a')
            handle:close()

            local totalCpu = 0
            for cpu in result:gmatch('[^\n]+') do
              if tonumber(cpu) then
                totalCpu = totalCpu + tonumber(cpu)
              end
            end

            return totalCpu
          end

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:lineGraph({
              title = 'CPU',
              interval = 1,
              maxValues = 100,
              maxGraphValue = nil,
              cmd = getCpuUsage,
            }),
          })

## Text

Displays a string generated by a lua function you pass in.

**Argument**

- a table with the following keys:
  - `title`: A string to display above the value
  - `interval`: The frequency at which to call the supplied command
  - `cmd`: A lua function that returns a number

**Example**

- Show the CPU load every second:

          function getCpuUsage()
            local handle = io.popen('ps -e -o %cpu')
            local result = handle:read('*a')
            handle:close()

            local totalCpu = 0
            for cpu in result:gmatch('[^\n]+') do
              if tonumber(cpu) then
                totalCpu = totalCpu + tonumber(cpu)
              end
            end

            return totalCpu
          end

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:text({
              title = 'CPU',
              interval = 1,
              cmd = getCpuUsage,
            }),
          })

## Xeyes

Adds a pair of eyes that follow your mouse around. I've found this increases my productivity
by about 42%. Inspired by the XWindows program of the same name.

The interval for updating the eyes to follow the mouse is dynamic so you can adjust
the reactivity and potential performance impact.

**Argument**

- a table with the following keys:
  - `minInterval`: The minimum interval used for the dynamic polling frequency
  - `maxInterval`: The maximum interval used for the dynamic polling frequency

**Example**

          spoon.HammerBar:addWidgetsPrimaryScreenLeft({
            spoon.HammerBar.widgets:xeyes({
              minInterval = 0.1,
              maxInterval = 3,
            }),
          })

# Keybindings

- Command + Control + Up inside a window:
  - Vertically maximize the currently focused window
- Shift + Click a button in the taskbar:
  - Print window info to the Hammerspoon console. Use this to get the `bundleId` if you want to add the app to an App Menu
- Command or Control + Click a button in an App Menu
  - Don't hide the menu after launching the app

# Why does HammerBar sometimes respond slowly?

Good question! I'm pretty sure it has to do with the internal workings of Hammerspoon
(the toolkit used by HammerBar).

HammerBar is definitely not an optimal implementation of a MacOS taskbar, however
the use of Hammerspoon and Lua provided a pretty low bar for me to create something
that does the trick (for me, at least).

Remember that HammerBar is written in an interpreted language (Lua), it has to poll
Hammerspoon for a list of windows, and has to poll
every application's window to keep the status (minimized or not as well as window title)
up to date.

If you have performance suggestions drop me a note!

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

-- Return a sum of the current cpu usage of every process
function getCpuUsage()
  local handle = io.popen('ps -e -o %cpu')
  local result = handle:read('*a')
  handle:close()

  local totalCpu = 0
  for cpu in result:gmatch('[^\n]+') do
    if tonumber(cpu) then
      totalCpu = totalCpu + tonumber(cpu)
    end
  end

  return totalCpu
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
