# Building

- Install the Node version specified in `.nvmrc`
- Install dependencies:

      npm ci

- Build an adhoc release:

      npm run build

- Or create a build with embedded version information:

      npm run build:release

- Copy the build to your Hammerspoon directory:

      mkdir -p ~/.hammerspoon/Spoons/HammerBar.spoon
      cp build/init.lua ~/.hammerspoon/Spoons/HammerBar.spoon/
