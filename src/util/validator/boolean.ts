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

class BaseBooleanValidator {
  optional() {
    return new OptionalBooleanValidator();
  }

  protected baseParse(input: unknown): boolean {
    if (typeof input !== 'boolean') {
      throw new Error('Must be a boolean');
    }

    return input;
  }
}

class BooleanValidator extends BaseBooleanValidator {
  parse(input: unknown) {
    return this.baseParse(input);
  }
}

class OptionalBooleanValidator extends BaseBooleanValidator {
  parse(input: unknown): undefined | boolean {
    if (input === undefined) {
      return undefined;
    }

    return this.baseParse(input);
  }
}

export const boolean = () => new BooleanValidator();
