# HammerBar - A Windows-Like Taskbar for MacOS

HammerBar is a "Spoon" for [HammerSpoon](https://www.hammerspoon.org) that displays
a clickable taskbar along the bottom of your screen and includes support for
multiple monitors. It can show buttons for custom app lists or individual apps
and can also show a digital clock.

It's not perfect, has some known bugs, but it's been my daily driver for the past
year and I think other people may find it useful.

![HammerBar example](doc/example.png)

## Getting Started
- install [Hammerspoon](https://www.hammerspoon.org)
- create the directory `~/.hammerspoon/Spoons/HammerBar.spoon/`
- copy `appMenuButton.png` and `init.lua`
  (from https://github.com/glenreesor/HammerBar/releases/tag/v0.9) to `~/.hammerspoon/Spoons/HammerBar.spoon/`
- add the following lines to `~/.Hammerspoon/init.lua`:

      hs.loadSpoon("HammerBar")
      spoon.HammerBar:start()

- set your Dock to autohide, otherwise the HammerBar taskbar will be *above* the dock.
- restart Hammerspoon

You should now have a basic taskbar. See below for more configuration options.

## Quirks
I don't know the cause of these -- they're either bugs in my code or Hammerspoon,
but I haven't tracked them down yet :-).

- some apps don't show up in the taskbar until they're explicitly focused (like Firefox)
- sometimes when adding a monitor, no taskbar will appear on it
- sometimes you need to restart Hammerspoon after your Mac sleeps in order for the
  taskbar(s) to be displayed properly

## Configuration
The following can be added to `~/.hammerspoon/init.lua` to enable more HammerBar features.
Add these lines before `spoon.HammerBar:start()`.

### Add a Launchpad Button

    spoon.HammerBar:addLaunchpadLauncher()

### Add an App Menu Button
You can add any number of buttons to show application menus by calling `addAppMenu()`
with a table of tables containing `bundleId` and `displayName` for the apps you want.

For example, the following will add an app menu that shows Safari, Firefox, and Chrome:

    spoon.HammerBar:addAppMenu({
      {
        bundleId = 'com.apple.Safari',
        displayName = 'Safari',
      },
      {
        bundleId = 'org.mozilla.firefox',
        displayName = 'Firefox',
      },
      {
        bundleId = 'com.google.Chrome',
        displayName = 'Chrome',
      },
    })

If you don't know the `bundleId` for the app you want to add, open the Hammerspoon
console, start the app normally, then Shift-Click on the app's button in the
HammerBar taskbar. Debugging information, including the `bundleId`, will be printed
to the Hammerspoon console.

### Add an App Launcher Button
Call `spoon.HammerBar:addAppLauncher()` with the bundle ID for the app you want.
For example, the following will add a button for Apple's text editor:

    spoon.HammerBar:addAppLauncher('com.apple.TextEdit')

### Add a Clock

    spoon.HammerBar:addClock()

## Keybindings
- Command + Control + Up: Vertically maximize the currently focused window
- When clicking on an app window button in the taskbar:
    - Shift: Print window info to the Hammerspoon console. Use this to get the `bundleId` if you want to add the app to an App Menu
    - Command or Control: Focus / raise the window instead of minimizing / maximizing
- When clicking on an app in an App Menu:
    - Command or Control: Don't hide the menu after launching the app
