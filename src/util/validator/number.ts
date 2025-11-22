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

type NumberConstraintFn = (s: number) => number;

abstract class BaseNumberValidator<CloneType> {
  protected numberConstraintFns: NumberConstraintFn[];

  constructor(numberConstraintFns: NumberConstraintFn[] = []) {
    this.numberConstraintFns = numberConstraintFns;
  }

  optional() {
    return new OptionalNumberValidator(this.numberConstraintFns);
  }

  positive() {
    const isPositive = (n: number) => {
      if (n <= 0) {
        throw new Error('Must be greater than zero.');
      }

      return n;
    };

    return this.clone([...this.numberConstraintFns, isPositive]);
  }

  protected baseParse(input: unknown) {
    if (typeof input !== 'number') {
      throw new Error('Must be a number.');
    }

    return this.numberConstraintFns.reduce((_acc, constraintFn) => {
      return constraintFn(input);
    }, input);
  }

  protected abstract clone(
    numberConstraintFns: NumberConstraintFn[],
  ): CloneType;
}

class NumberValidator extends BaseNumberValidator<NumberValidator> {
  parse(input: unknown): number {
    return this.baseParse(input);
  }

  protected clone(numberValidators: NumberConstraintFn[]) {
    return new NumberValidator(numberValidators);
  }
}

class OptionalNumberValidator extends BaseNumberValidator<OptionalNumberValidator> {
  parse(input: unknown): number | undefined {
    if (input === undefined) return undefined;
    return this.baseParse(input);
  }

  protected clone(numberConstraintFns: NumberConstraintFn[]) {
    return new OptionalNumberValidator(numberConstraintFns);
  }
}

export const number = () => new NumberValidator();
