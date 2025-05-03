# Widgets

One or more widgets from below can be added using:

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

          local chromeLauncher = spoon.HammerBar.widgets:appLauncher('com.google.Chrome');
          spoon.HammerBar:addWidgetsPrimaryScreenLeft({ chromeLauncher });

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

          local appMenu1 = spoon.HammerBar.widgets:appMenu({
              appList = {
                { bundleId = 'com.apple.Safari', label = 'Safari' },
                { bundleId = 'com.apple.finder', label = 'Finder' },
              },
          });
          spoon.HammerBar:addWidgetsPrimaryScreenLeft({ appMenu1 });

- Add an app menu that uses the System Preferences icon for the launcher, with buttons for Safari and the Finder

          local appMenu2 = spoon.HammerBar.widgets:appMenu({
              appList = {
                { bundleId = 'com.apple.Safari', label = 'Safari' },
                { bundleId = 'com.apple.finder', label = 'Finder' },
              },
              icon = { bundleId = 'com.apple.systempreferences' },
          });
          spoon.HammerBar:addWidgetsPrimaryScreenLeft({ appMenu2 });

- Add an app menu that uses the image at `~/myMenuButton.jpg` for the launcher, with buttons for Safari and the Finder

          local appMenu3 = spoon.HammerBar.widgets:appMenu({
              appList = {
                { bundleId = 'com.apple.Safari', label = 'Safari' },
                { bundleId = 'com.apple.finder', label = 'Finder' },
              },
              icon = { imagePath = '~/myMenuButton.jpg' },
          });
          spoon.HammerBar:addWidgetsPrimaryScreenLeft({ appMenu3 });

## Clock

Adds a simple clock clock. There are 3 variants available:

- default: a simple digital clock with date
- **Analog Clock**: simple analog clock with optional second hand
- **Analog Circles Clock**: analog clock with rotating circles instead of hands

### Default Clock

**Argument**

- One of:
  - nothing (date will be formatting according to your locacle)
  - table with one of both of the following keys:
    - `dateFormat`
      - A string specifying how to format the date, for example
        `'YYYY.MM.DD'` --> 2025.01.31
      - Valid placeholders are:
        - YYYY - 4 digit year
        - YY - 2 digit year
        - MMM - Abbreviated short month name e.g. 'Mar'
        - MM - 2 digit month number e.g. '03'
        - DDD - Abbreviated short day name e.g. 'Mon'
        - DD - 2 digit day number e.g. '10'
    - `timeFormat`
      - A string specifying how to format the time, for example
        `'h:mm:ss'` --> 1:29:39
      - Valid placeholders are:
        - HH - 0-padded hour (00-23)
        - h - hour (0-12)
        - mm - Minute (00-59)
        - ss - Second (00-61)
        - aa - 'a.m.' or 'p.m.' as appropriate
        - a - 'am' or 'pm' as appropriate
        - A - 'AM' or 'PM' as appropriate

**Examples**

          local defaultClock = spoon.HammerBar.widgets:clock();

          local clockWithDateFormat = spoon.HammerBar.widgets:clock({
            dateFormat = 'YYYY-MMM-DD',
          });

          local clockWithTimeFormat = spoon.HammerBar.widgets:clock({
            timeFormat = 'h:mm:ssaa',
          });

          local clockWithDateAndTimeFormat = spoon.HammerBar.widgets:clock({
            dateFormat = 'YYYY-MMM-DD',
            timeFormat = 'h:mm:ssaa',
          });

          spoon.HammerBar:addWidgetsPrimaryScreenRight({ defaultClock });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ clockWithDateFormat });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ clockWithTimeFormat });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ clockWithDateAndTimeFormat });

### Analog Clock

**Argument**

- A table with the following keys:
  - `type` with the value `'analog-clock'`
  - `showSeconds`: true or false

**Example**

          local analogClock = spoon.HammerBar.widgets:clock({
            type = 'analog-clock',
            showSeconds = true,
          });

          spoon.HammerBar:addWidgetsPrimaryScreenRight({ analogClock });

### Analog Circles Clock

**Argument**

- A table with the following keys:
  - `type` with the value `'analog-circles-clock'`
  - `showSeconds`: true or false
  - `showCirclePaths`: true or false

**Example**

          local analogCirclesClock = spoon.HammerBar.widgets:clock({
            type = 'analog-circles-clock',
            showSeconds = true,
            showCirclePaths = false,
          });

          spoon.HammerBar:addWidgetsPrimaryScreenRight({ analogCirclesClock });

## Cpu Monitor

Shows current CPU usage as either text or a line graph.

**Argument**

- a table with the following keys:
  - `type`: One of `'graph'` or `'text'`
  - `interval`: Update interval in seconds
  - `maxValues`: Maximum number of values to display for the graph variant

**Examples**

- Draw a graph of CPU usage (%), updating it every second:

          local cpuGraph = spoon.HammerBar.widgets:cpuMonitor({
            type = 'graph',
            interval = 1,
            maxValues = 100,
          });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ cpuGraph });

- Show current CPU usage (%) as text, updating it every second:

          local cpuText = spoon.HammerBar.widgets:cpuMonitor({
            type = 'text',
            interval = 1,
          });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ cpuText });

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

- Draw a graph of the load average, updating it every second:

          function getLoadAverage()
            local handle = io.popen("w | awk '{print $8}'")
            local result = handle:read('*a')
            handle:close()

            return tonumber(result)
          end

          local loadAverageGraph = spoon.HammerBar.widgets:lineGraph({
            title = 'Load',
            interval = 1,
            maxValues = 100,
            maxGraphValue = nil,
            cmd = getLoadAverage,
          });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ loadAverageGraph });

## Line Graph Current Value

Draws a line graph using numbers generated by a lua function you pass in.
Identical to **Line Graph** except:

- shows the current value at the top right rather than the max represented on
  the graph
- doesn't show anything on hover since we now always see the current value

**Argument**

- a table with the following keys:
  - `title`: A string to display above the graph
  - `interval`: The frequency at which to call the supplied command
  - `maxValues`: The maximum number of values to retain in the graph
  - `maxGraphValue`: The highest y-value to use for the graph. Dynamic if omitted
  - `cmd`: A lua function that returns a number

**Example**

- Draw a graph of the load average, updating it every second:

          function getLoadAverage()
            local handle = io.popen("w | awk '{print $8}'")
            local result = handle:read('*a')
            handle:close()

            return tonumber(result)
          end

          local loadAverageGraph = spoon.HammerBar.widgets:lineGraphCurrentValue({
            title = '# Proc',
            interval = 1,
            maxValues = 100,
            maxGraphValue = nil,
            cmd = getNumProcesses,
          });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ loadAverageGraph });

## Text

Displays a string generated by a lua function you pass in.

**Argument**

- a table with the following keys:
  - `title`: A string to display above the value
  - `interval`: The frequency at which to call the supplied command
  - `cmd`: A lua function that returns a number

**Example**

- Show number of running processes, updated every second

          function getLoadAverage()
            local handle = io.popen("w | awk '{print $8}'")
            local result = handle:read('*a')
            handle:close()

            return result
          end

          local loadAverageText = spoon.HammerBar.widgets:text({
            title = '# Proc',
            interval = 1,
            cmd = getNumProcesses,
          });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ loadAverageText });

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

          local xeyes = spoon.HammerBar.widgets:xeyes({
            minInterval = 0.1,
            maxInterval = 3,
          });
          spoon.HammerBar:addWidgetsPrimaryScreenRight({ xeyes });
