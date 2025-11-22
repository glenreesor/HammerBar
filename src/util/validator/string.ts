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

type StringConstraintFn = (s: string) => string;

abstract class BaseStringValidator<CloneType> {
  protected stringConstraintFns: StringConstraintFn[];

  constructor(stringConstraintFns: StringConstraintFn[] = []) {
    this.stringConstraintFns = stringConstraintFns;
  }

  nonEmpty() {
    const isNonEmpty = (s: string) => {
      if (s === '') {
        throw new Error('Must be a non-empty string.');
      }

      return s;
    };

    return this.clone([...this.stringConstraintFns, isNonEmpty]);
  }

  optional() {
    return new OptionalStringValidator(this.stringConstraintFns);
  }

  protected baseParse(input: unknown) {
    if (typeof input !== 'string') {
      throw new Error('Must be a string.');
    }

    return this.stringConstraintFns.reduce((_acc, constraintFn) => {
      return constraintFn(input);
    }, input);
  }

  protected abstract clone(
    stringConstraintFns: StringConstraintFn[],
  ): CloneType;
}

class StringValidator extends BaseStringValidator<StringValidator> {
  parse(input: unknown): string {
    return this.baseParse(input);
  }

  protected clone(stringConstraintFns: StringConstraintFn[]) {
    return new StringValidator(stringConstraintFns);
  }
}

class OptionalStringValidator extends BaseStringValidator<OptionalStringValidator> {
  parse(input: unknown): string | undefined {
    if (input === undefined) return undefined;
    return this.baseParse(input);
  }

  protected clone(stringConstraintFns: StringConstraintFn[]) {
    return new OptionalStringValidator(stringConstraintFns);
  }
}

export const string = () => new StringValidator();
