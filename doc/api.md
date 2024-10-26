# API

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
