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

type LiteralType = string | number | undefined | null;

class BaseLiteralValidator<L extends LiteralType> {
  protected expectedLiteral: L;

  constructor(expectedLiteral: L) {
    this.expectedLiteral = expectedLiteral;
  }

  optional() {
    return new OptionalLiteralValidator<L>(this.expectedLiteral);
  }

  protected baseParse(input: unknown): L {
    if (!this.isLiteral(input)) {
      throw new Error(`Must be ${this.expectedLiteral}`);
    }

    return input;
  }

  private isLiteral(input: unknown): input is L {
    return input === this.expectedLiteral;
  }
}

class LiteralValidator<L extends LiteralType> extends BaseLiteralValidator<L> {
  parse(input: unknown): L {
    return this.baseParse(input);
  }
}

class OptionalLiteralValidator<
  L extends LiteralType,
> extends BaseLiteralValidator<L> {
  parse(input: unknown): undefined | L {
    if (input === undefined) {
      return undefined;
    }

    return this.baseParse(input);
  }
}

export const literal = <L extends LiteralType>(literal: L) =>
  new LiteralValidator(literal);
