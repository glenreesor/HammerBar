local module = {}

function module: luaType(object)
  return type(object)
end

return module
