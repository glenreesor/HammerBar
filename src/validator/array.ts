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

type ElementValidator<T> = { parse: (v: unknown) => T };

type ValidatedArrayShape<T extends ElementValidator<any>> = ReturnType<
  T['parse']
>[];

type ArrayConstraintFn<T extends any[]> = (a: T) => T;

abstract class BaseArrayValidator<EV extends ElementValidator<any>, CloneType> {
  protected elementValidator: EV;
  protected arrayConstraintFns: ArrayConstraintFn<ValidatedArrayShape<EV>>[];

  constructor(
    elementValidator: EV,
    arrayConstraintFns: ArrayConstraintFn<ValidatedArrayShape<EV>>[] = [],
  ) {
    this.elementValidator = elementValidator;
    this.arrayConstraintFns = arrayConstraintFns;
  }

  nonEmpty() {
    function isNonEmpty(a: ValidatedArrayShape<EV>) {
      if (a.length === 0) {
        throw new Error('Must be a non-empty array.');
      }

      return a;
    }

    return this.clone([...this.arrayConstraintFns, isNonEmpty]);
  }

  optional() {
    return new OptionalArrayValidator(
      this.elementValidator,
      this.arrayConstraintFns,
    );
  }

  protected baseParse(input: unknown): ValidatedArrayShape<EV> {
    if (!Array.isArray(input)) {
      throw new Error('Must be an array.');
    }

    const arrayWithValidElements = [] as ValidatedArrayShape<EV>;

    input.forEach((_el, index) => {
      arrayWithValidElements[index] = this.elementValidator.parse(input[index]);
    });

    return this.arrayConstraintFns.reduce((_acc, constraintFn) => {
      return constraintFn(arrayWithValidElements);
    }, arrayWithValidElements);
  }

  protected abstract clone(
    arrayConstraintFns: ArrayConstraintFn<ValidatedArrayShape<EV>>[],
  ): CloneType;
}

class ArrayValidator<
  EV extends ElementValidator<any>,
> extends BaseArrayValidator<EV, ArrayValidator<EV>> {
  parse(input: unknown): ValidatedArrayShape<EV> {
    return this.baseParse(input);
  }

  protected clone(
    arrayConstraintFns: ArrayConstraintFn<ValidatedArrayShape<EV>>[],
  ) {
    return new ArrayValidator<EV>(this.elementValidator, arrayConstraintFns);
  }
}

class OptionalArrayValidator<
  EV extends ElementValidator<any>,
> extends BaseArrayValidator<EV, OptionalArrayValidator<EV>> {
  parse(input: unknown): ValidatedArrayShape<EV> | undefined {
    if (input === undefined) return undefined;

    return this.baseParse(input);
  }

  protected clone(
    arrayConstraintFns: ArrayConstraintFn<ValidatedArrayShape<EV>>[],
  ) {
    return new OptionalArrayValidator<EV>(
      this.elementValidator,
      arrayConstraintFns,
    );
  }
}

export function array<EV extends ElementValidator<any>>(elementValidator: EV) {
  return new ArrayValidator<EV>(elementValidator);
}
