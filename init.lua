--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]

local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file, ...)
    if ____moduleCache[file] then
        return ____moduleCache[file].value
    end
    if ____modules[file] then
        local module = ____modules[file]
        ____moduleCache[file] = { value = (select("#", ...) > 0) and module(...) or module(file) }
        return ____moduleCache[file].value
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["hammerspoonUtils"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
function ____exports.getScreenInfo(self, screen)
    local id = screen:id()
    local name = screen:name()
    if name == nil then
        name = "Unknown"
    end
    local frame = screen:frame()
    return {
        id = id,
        name = name,
        x = frame.x,
        y = frame.y,
        width = frame.w,
        height = frame.h
    }
end
function ____exports.getWindowInfo(self, window)
    local application = window:application()
    local appName
    if application == nil then
        appName = "Unknown"
    else
        appName = application:name()
    end
    return {
        appName = appName,
        id = window:id(),
        isMinimized = window:isMinimized(),
        isStandard = window:isStandard(),
        screenId = window:screen():id(),
        windowTitle = window:title()
    }
end
return ____exports
 end,
["drawing"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

local ____exports = {}
____exports.BUTTON_PADDING = 5
____exports.BUTTON_WIDTH = 130
local BLACK = {red = 0, green = 0, blue = 0}
local WHITE = {red = 1, green = 1, blue = 1}
function ____exports.getButtonHeight(self, fontSize)
    return fontSize * 2 + 8
end
function ____exports.getCanvasHeight(self, fontSize)
    return fontSize * 2 + 14
end
local height
local width
local color
function ____exports.getTaskbarElements(self, ____bindingPattern0)
    color = ____bindingPattern0.color
    width = ____bindingPattern0.width
    height = ____bindingPattern0.height
    return {type = "rectangle", fillColor = color, frame = {x = 0, y = 0, w = width, h = height}}
end
local getWindowIconColor
local getAppNameAndWindowTitle
local window
local y
local x
local fontSize
function ____exports.getWindowButtonElements(self, ____bindingPattern0)
    fontSize = ____bindingPattern0.fontSize
    x = ____bindingPattern0.x
    y = ____bindingPattern0.y
    window = ____bindingPattern0.window
    getAppNameAndWindowTitle = ____bindingPattern0.getAppNameAndWindowTitle
    getWindowIconColor = ____bindingPattern0.getWindowIconColor
    local ICON_WIDTH = 15
    local ICON_PADDING_LEFT = 4
    local TEXT_PADDING_LEFT = 3
    local VERTICAL_PADDING = 2
    local MAX_TEXT_WIDTH = ____exports.BUTTON_WIDTH - ICON_WIDTH - ICON_PADDING_LEFT - TEXT_PADDING_LEFT - 4
    local buttonHeight = ____exports.getButtonHeight(nil, fontSize)
    local iconX = x + ICON_PADDING_LEFT
    local textX = iconX + ICON_WIDTH + TEXT_PADDING_LEFT
    local textLine1Y = y
    local textLine2Y = textLine1Y + fontSize + VERTICAL_PADDING
    local iconHeight
    local iconY
    if window.isMinimized then
        iconHeight = fontSize - 1
        iconY = y + fontSize + VERTICAL_PADDING * 2
    else
        iconHeight = fontSize * 2 - 1
        iconY = y + 4
    end
    local iconColor = getWindowIconColor(nil, window)
    local ____getAppNameAndWindowTitle_result_0 = getAppNameAndWindowTitle(nil, window)
    local appNameToDisplay = ____getAppNameAndWindowTitle_result_0.appNameToDisplay
    local windowTitleToDisplay = ____getAppNameAndWindowTitle_result_0.windowTitleToDisplay
    local clickId = window.id
    local canvasElements = {{
        type = "rectangle",
        fillColor = WHITE,
        frame = {x = x, y = y, w = ____exports.BUTTON_WIDTH, h = buttonHeight},
        roundedRectRadii = {xRadius = 5, yRadius = 5},
        trackMouseUp = true,
        id = clickId
    }, {
        type = "rectangle",
        fillColor = iconColor,
        frame = {x = iconX, y = iconY, w = ICON_WIDTH, h = iconHeight},
        roundedRectRadii = {xRadius = 6, yRadius = 6},
        trackMouseUp = true,
        id = clickId
    }, {
        type = "text",
        text = windowTitleToDisplay,
        textColor = BLACK,
        textSize = fontSize,
        textLineBreak = "clip",
        frame = {x = textX, y = textLine1Y, w = MAX_TEXT_WIDTH, h = fontSize + 8},
        trackMouseUp = true,
        id = clickId
    }, {
        type = "text",
        text = appNameToDisplay,
        textColor = BLACK,
        textSize = fontSize,
        textLineBreak = "clip",
        frame = {x = textX, y = textLine2Y, w = MAX_TEXT_WIDTH, h = fontSize + 8},
        trackMouseUp = true,
        id = clickId
    }}
    if not window.isStandard then
        __TS__ArrayPush(canvasElements, {type = "rectangle", fillColor = BLACK, strokeColor = BLACK, frame = {x = iconX + ICON_WIDTH / 2, y = iconY, w = 1, h = iconHeight}})
    end
    return canvasElements
end
return ____exports
 end,
["init"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
____symbolMetatable = {__tostring = function(self)
    return ("Symbol(" .. (self.description or "")) .. ")"
end}
function __TS__Symbol(description)
    return setmetatable({description = description}, ____symbolMetatable)
end
Symbol = {
    iterator = __TS__Symbol("Symbol.iterator"),
    hasInstance = __TS__Symbol("Symbol.hasInstance"),
    species = __TS__Symbol("Symbol.species"),
    toStringTag = __TS__Symbol("Symbol.toStringTag")
}

function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

function __TS__IteratorGeneratorStep(self)
    local co = self.____coroutine
    local status, value = coroutine.resume(co)
    if not status then
        error(value, 0)
    end
    if coroutine.status(co) == "dead" then
        return
    end
    return true, value
end
function __TS__IteratorIteratorStep(self)
    local result = self:next()
    if result.done then
        return
    end
    return true, result.value
end
function __TS__IteratorStringStep(self, index)
    index = index + 1
    if index > #self then
        return
    end
    return index, string.sub(self, index, index)
end
function __TS__Iterator(iterable)
    if type(iterable) == "string" then
        return __TS__IteratorStringStep, iterable, 0
    elseif iterable.____coroutine ~= nil then
        return __TS__IteratorGeneratorStep, iterable
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        return __TS__IteratorIteratorStep, iterator
    else
        return ipairs(iterable)
    end
end

function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

Map = __TS__Class()
Map.name = "Map"
function Map.prototype.____constructor(self, entries)
    self[Symbol.toStringTag] = "Map"
    self.items = {}
    self.size = 0
    self.nextKey = {}
    self.previousKey = {}
    if entries == nil then
        return
    end
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            self:set(value[1], value[2])
        end
    else
        local array = entries
        for ____, kvp in ipairs(array) do
            self:set(kvp[1], kvp[2])
        end
    end
end
function Map.prototype.clear(self)
    self.items = {}
    self.nextKey = {}
    self.previousKey = {}
    self.firstKey = nil
    self.lastKey = nil
    self.size = 0
end
function Map.prototype.delete(self, key)
    local contains = self:has(key)
    if contains then
        self.size = self.size - 1
        local next = self.nextKey[key]
        local previous = self.previousKey[key]
        if next and previous then
            self.nextKey[previous] = next
            self.previousKey[next] = previous
        elseif next then
            self.firstKey = next
            self.previousKey[next] = nil
        elseif previous then
            self.lastKey = previous
            self.nextKey[previous] = nil
        else
            self.firstKey = nil
            self.lastKey = nil
        end
        self.nextKey[key] = nil
        self.previousKey[key] = nil
    end
    self.items[key] = nil
    return contains
end
function Map.prototype.forEach(self, callback)
    for ____, key in __TS__Iterator(self:keys()) do
        callback(_G, self.items[key], key, self)
    end
end
function Map.prototype.get(self, key)
    return self.items[key]
end
function Map.prototype.has(self, key)
    return self.nextKey[key] ~= nil or self.lastKey == key
end
function Map.prototype.set(self, key, value)
    local isNewValue = not self:has(key)
    if isNewValue then
        self.size = self.size + 1
    end
    self.items[key] = value
    if self.firstKey == nil then
        self.firstKey = key
        self.lastKey = key
    elseif isNewValue then
        self.nextKey[self.lastKey] = key
        self.previousKey[key] = self.lastKey
        self.lastKey = key
    end
    return self
end
Map.prototype[Symbol.iterator] = function(self)
    return self:entries()
end
function Map.prototype.entries(self)
    local ____temp_0 = self
    local items = ____temp_0.items
    local nextKey = ____temp_0.nextKey
    local key = self.firstKey
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = not key, value = {key, items[key]}}
            key = nextKey[key]
            return result
        end
    }
end
function Map.prototype.keys(self)
    local nextKey = self.nextKey
    local key = self.firstKey
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = not key, value = key}
            key = nextKey[key]
            return result
        end
    }
end
function Map.prototype.values(self)
    local ____temp_1 = self
    local items = ____temp_1.items
    local nextKey = ____temp_1.nextKey
    local key = self.firstKey
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = not key, value = items[key]}
            key = nextKey[key]
            return result
        end
    }
end
Map[Symbol.species] = Map
Map = Map

function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

__TS__parseInt_base_pattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
function __TS__ParseInt(numberString, base)
    if base == nil then
        base = 10
        local hexMatch = string.match(numberString, "^%s*-?0[xX]")
        if hexMatch then
            base = 16
            local ____string_match_result__0_0
            if string.match(hexMatch, "-") then
                ____string_match_result__0_0 = "-" .. __TS__StringSubstr(numberString, #hexMatch)
            else
                ____string_match_result__0_0 = __TS__StringSubstr(numberString, #hexMatch)
            end
            numberString = ____string_match_result__0_0
        end
    end
    if base < 2 or base > 36 then
        return 0 / 0
    end
    local ____temp_1
    if base <= 10 then
        ____temp_1 = __TS__StringSubstring(__TS__parseInt_base_pattern, 0, base)
    else
        ____temp_1 = __TS__StringSubstr(__TS__parseInt_base_pattern, 0, 10 + 2 * (base - 10))
    end
    local allowedDigits = ____temp_1
    local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
    local number = tonumber(
        string.match(numberString, pattern),
        base
    )
    if number == nil then
        return 0 / 0
    end
    if number >= 0 then
        return math.floor(number)
    else
        return math.ceil(number)
    end
end

function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

function __TS__ArrayFilter(arr, callbackfn)
    local result = {}
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                result[#result + 1] = arr[i + 1]
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k, len do
        if self[i + 1] == searchElement then
            return true
        end
    end
    return false
end

function __TS__ArraySort(arr, compareFn)
    if compareFn ~= nil then
        table.sort(
            arr,
            function(a, b) return compareFn(_G, a, b) < 0 end
        )
    else
        table.sort(arr)
    end
    return arr
end

local ____exports = {}
local getAppNameAndWindowTitle, getWindowIconColor, onTaskbarClick, updateAllTaskbars, updateCanvasesByScreenId, updateTaskbar, config, state
local ____drawing = require("drawing")
local BUTTON_PADDING = ____drawing.BUTTON_PADDING
local BUTTON_WIDTH = ____drawing.BUTTON_WIDTH
local getButtonHeight = ____drawing.getButtonHeight
local getCanvasHeight = ____drawing.getCanvasHeight
local getTaskbarElements = ____drawing.getTaskbarElements
local getWindowButtonElements = ____drawing.getWindowButtonElements
local ____hammerspoonUtils = require("hammerspoonUtils")
local getScreenInfo = ____hammerspoonUtils.getScreenInfo
local getWindowInfo = ____hammerspoonUtils.getWindowInfo
function getAppNameAndWindowTitle(self, window)
    local userConfig = config.userAppNamesAndWindowTitles and config.userAppNamesAndWindowTitles or ({})
    local returnValue = {appNameToDisplay = window.appName, windowTitleToDisplay = window.windowTitle}
    __TS__ArrayForEach(
        userConfig,
        function(____, configObject)
            if configObject.appName == window.appName and (configObject.windowTitle == window.windowTitle or not configObject.windowTitle) then
                if configObject.displayAppName then
                    returnValue.appNameToDisplay = configObject.displayAppName
                end
                if configObject.displayWindowTitle then
                    returnValue.windowTitleToDisplay = configObject.displayWindowTitle
                end
            end
        end
    )
    return returnValue
end
function getWindowIconColor(self, window)
    local userColors = config.userColors
    local ____userColors_appNames_0 = userColors
    if ____userColors_appNames_0 ~= nil then
        ____userColors_appNames_0 = ____userColors_appNames_0.appNames
    end
    local userColorsAppNames = ____userColors_appNames_0
    local userColor
    if not userColorsAppNames or not userColorsAppNames[window.appName] then
        return config.defaultColors.icons
    end
    userColor = userColorsAppNames[window.appName]
    if type(userColor) == "table" then
        return userColor
    else
        if userColors.appGroups and userColors.appGroups[userColor] then
            return userColors.appGroups[userColor]
        end
        return config.defaultColors.icons
    end
end
function onTaskbarClick(_canvas, _message, id)
    local idAsNumber = type(id) == "number" and id or __TS__ParseInt(id)
    local hsWindow = hs.window.get(idAsNumber)
    if not hsWindow then
        return
    end
    if hsWindow:isMinimized() then
        hsWindow:unminimize()
    else
        hsWindow:minimize()
    end
    updateAllTaskbars(nil)
end
function updateAllTaskbars(self)
    local allWindows = {}
    local allScreens = {}
    local hammerspoonWindowFound = false
    __TS__ArrayForEach(
        hs.window.allWindows(),
        function(____, hammerspoonWindow)
            local windowInfo = getWindowInfo(nil, hammerspoonWindow)
            __TS__ArrayPush(allWindows, windowInfo)
            if windowInfo.appName == "Hammerspoon" then
                hammerspoonWindowFound = true
            end
        end
    )
    if state.canvasesByScreenId.size > 0 and not hammerspoonWindowFound then
        print("Hammerbar: No Hammerspoon windows. Skipping taskbar updates.")
        return
    end
    __TS__ArrayForEach(
        hs.screen.allScreens(),
        function(____, hammerspoonScreen)
            local screenInfo = getScreenInfo(nil, hammerspoonScreen)
            __TS__ArrayPush(allScreens, screenInfo)
        end
    )
    updateCanvasesByScreenId(nil, allScreens)
    __TS__ArrayForEach(
        allScreens,
        function(____, screen)
            local windowsThisScreen = __TS__ArrayFilter(
                allWindows,
                function(____, window) return window.screenId == screen.id end
            )
            local canvas = state.canvasesByScreenId:get(screen.id)
            if not canvas then
                print("Hammerbar: No canvas for screen " .. tostring(screen.id))
            else
                updateTaskbar(nil, canvas, {width = screen.width, height = screen.height}, windowsThisScreen)
            end
        end
    )
end
function updateCanvasesByScreenId(self, allScreens)
    __TS__ArrayForEach(
        allScreens,
        function(____, screen)
            if not state.canvasesByScreenId:get(screen.id) then
                print("Adding canvas for screen: " .. tostring(screen.id))
                local canvasHeight = getCanvasHeight(nil, config.fontSize)
                local newCanvas = hs.canvas.new({x = screen.x, y = screen.y + screen.height - canvasHeight, w = screen.width, h = canvasHeight})
                newCanvas:show()
                state.canvasesByScreenId:set(screen.id, newCanvas)
                newCanvas:mouseCallback(onTaskbarClick)
            end
        end
    )
    state.canvasesByScreenId:forEach(function(____, canvas, screenId)
        local foundScreens = __TS__ArrayFilter(
            allScreens,
            function(____, screen) return screen.id == screenId end
        )
        if #foundScreens == 0 then
            print("Removing canvas for screen: " .. tostring(screenId))
            canvas:delete()
            state.canvasesByScreenId:delete(screenId)
        end
    end)
end
function updateTaskbar(self, canvas, dimensions, windows)
    local buttonHeight = getButtonHeight(nil, config.fontSize)
    local canvasHeight = getCanvasHeight(nil, config.fontSize)
    canvas:replaceElements(getTaskbarElements(nil, {color = config.defaultColors.taskbar, width = dimensions.width, height = dimensions.height}))
    local appNames = {}
    __TS__ArrayForEach(
        windows,
        function(____, window)
            if not __TS__ArrayIncludes(appNames, window.appName) then
                __TS__ArrayPush(appNames, window.appName)
            end
        end
    )
    __TS__ArraySort(appNames)
    local x = BUTTON_PADDING
    local y = (canvasHeight - buttonHeight) / 2
    __TS__ArrayForEach(
        appNames,
        function(____, appName)
            local windowsThisApp = __TS__ArrayFilter(
                windows,
                function(____, window) return window.appName == appName end
            )
            __TS__ArrayForEach(
                windowsThisApp,
                function(____, window)
                    canvas:appendElements(getWindowButtonElements(nil, {
                        fontSize = config.fontSize,
                        x = x,
                        y = y,
                        window = window,
                        getAppNameAndWindowTitle = getAppNameAndWindowTitle,
                        getWindowIconColor = getWindowIconColor
                    }))
                    x = x + BUTTON_WIDTH
                    if x + BUTTON_WIDTH > dimensions.width then
                        x = BUTTON_PADDING
                        y = y + 15
                    end
                end
            )
        end
    )
end
config = {fontSize = 13, defaultColors = {taskbar = {red = 180 / 255, green = 180 / 255, blue = 180 / 255}, icons = {red = 132 / 255, green = 132 / 255, blue = 130 / 255}}}
state = {
    canvasesByScreenId = __TS__New(Map),
    doitTimer = nil
}
local function setAppNamesAndWindowTitles(self, appNamesAndWindowTitles)
    config.userAppNamesAndWindowTitles = appNamesAndWindowTitles
end
local function setColors(self, colors)
    config.userColors = colors
end
local function start(self)
    updateAllTaskbars(nil)
    state.doitTimer = hs.timer.doEvery(0.5, updateAllTaskbars)
end
local function stop(self)
    if state.doitTimer then
        state.doitTimer:stop()
    end
end
local hammerbar = {setAppNamesAndWindowTitles = setAppNamesAndWindowTitles, setColors = setColors, start = start, stop = stop}
return hammerbar
 end,
}
return require("init", ...)
