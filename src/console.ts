// Copyright 2025 Glen Reesor
//
// This file is part of HammerBar.
//
// HammerBar is free software: you can redistribute it and/or
// modify it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or (at your
// option) any later version.
//
// HammerBar is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.
//
// You should have received a copy of the GNU General Public License along with
// HammerBar. If not, see <https://www.gnu.org/licenses/>.

const PREFIX = 'HammberBar';

type PrintableThing = string | number | boolean | Object;

function getFormattedOutput(args: PrintableThing[]) {
  let output = '';
  let lastArgWasObject = false;

  args.forEach((arg, index) => {
    if (lastArgWasObject) {
      lastArgWasObject = false;
      output += '\n';
    } else if (index > 0) {
      output += ' ';
    }

    switch (typeof arg) {
      case 'string':
        output += arg;
        break;

      case 'number':
      case 'boolean':
        output += arg.toString();
        break;

      case 'object':
        output += '\n';
        output += hs.inspect.inspect(arg);
        lastArgWasObject = true;
        break;
    }
  });

  return output;
}

function printWithColor(args: {
  logType: 'info' | 'log' | 'warn' | 'error';
  argsToPrint: PrintableThing[];
}) {
  const { logType, argsToPrint } = args;

  const INFO_COLOR = { red: 0, green: 0, blue: 1 };
  const LOG_COLOR = { red: 0.3, green: 0.3, blue: 0.3 };
  const WARN_COLOR = { red: 1, green: 0.5, blue: 0 };
  const ERROR_COLOR = { red: 1, green: 0, blue: 0 };

  const originalConsoleFg = hs.console.consolePrintColor();
  const textColor =
    logType === 'info'
      ? INFO_COLOR
      : logType === 'log'
        ? LOG_COLOR
        : logType === 'warn'
          ? WARN_COLOR
          : ERROR_COLOR;

  const formattedOutput = getFormattedOutput(argsToPrint);
  const prefix = `${PREFIX}: ${logType.toUpperCase()}:`;

  hs.console.consolePrintColor(textColor);
  print(`${prefix} ${formattedOutput}`);

  hs.console.consolePrintColor(originalConsoleFg);
}

/**
 * Print the specified args in blue.
 * Put adjacent scalars on the same output line and objects on new lines
 *
 * It would be nice to accepted `undefined`, but tstl will omit an `undefined`
 * value if it's the last in the `args` spread.
 *
 * Also don't accept functions because hammerspoon just prints the hex address
 * where it lives (as opposed to the actual contents of the function).
 */
function info(...args: PrintableThing[]) {
  printWithColor({ logType: 'info', argsToPrint: args });
}

/**
 * Print the specified args in grey.
 * Put adjacent scalars on the same output line and objects on new lines
 *
 * It would be nice to accepted `undefined`, but tstl will omit an `undefined`
 * value if it's the last in the `args` spread.
 *
 * Also don't accept functions because hammerspoon just prints the hex address
 * where it lives (as opposed to the actual contents of the function).
 */
function log(...args: PrintableThing[]) {
  printWithColor({ logType: 'log', argsToPrint: args });
}

/**
 * Print the specified args in orange.
 *
 * Put adjacent scalars on the same output line and objects on new lines.
 *
 * It would be nice to accepted `undefined`, but tstl will omit an `undefined`
 * value if it's the last in the `args` spread.
 *
 * Also don't accept functions because hammerspoon just prints the hex address
 * where it lives (as opposed to the actual contents of the function).
 */
function warn(...args: PrintableThing[]) {
  printWithColor({ logType: 'warn', argsToPrint: args });
}

/**
 * Print the specified args in red.
 * Put adjacent scalars on the same output line and objects on new lines
 *
 * It would be nice to accepted `undefined`, but tstl will omit an `undefined`
 * value if it's the last in the `args` spread.
 *
 * Also don't accept functions because hammerspoon just prints the hex address
 * where it lives (as opposed to the actual contents of the function).
 */
function error(...args: PrintableThing[]) {
  printWithColor({ logType: 'error', argsToPrint: args });
}

export const console = {
  info,
  log,
  warn,
  error,
};
