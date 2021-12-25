type LUA_TYPE =
    'nil' |
    'boolean' |
    'number' |
    'string' |
    'function' |
    'userdata' |
    'thread' |
    'table';

/**
 * Return the type of the passed object, but using a type assertion to match
 * the values that the lua `type` function returns, since they're different
 * from what typescript is expecting.
 */
export function luaType(object: any): LUA_TYPE {
  return typeof object as LUA_TYPE;
}
