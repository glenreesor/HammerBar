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

type FieldValidator<T> = { parse: (v: unknown) => T };
type AllFieldValidators = Record<string, FieldValidator<any>>;

type ValidatedObjectShape<T> = {
  [F in keyof T]: T[F] extends FieldValidator<infer R> ? R : never;
};

abstract class BaseObjectValidator<
  FV extends AllFieldValidators,
  RequiredOrOptionalObjectValidator,
> {
  protected memberValidators: FV;

  constructor(memberValidators: FV) {
    this.memberValidators = memberValidators;
  }

  optional() {
    return new OptionalObjectValidator(this.memberValidators);
  }

  protected baseParse(v: unknown): ValidatedObjectShape<FV> {
    if (!isStringIndexableObject(v)) {
      throw new Error('Must be an object.');
    }

    for (const key in v) {
      if (!this.memberValidators[key]) {
        throw new Error(`Unexpected key found: ${key}`);
      }
    }

    const objectWithValidFields = {} as ValidatedObjectShape<FV>;

    for (const key in this.memberValidators) {
      if (this.memberValidators[key]) {
        const memberValidator = this.memberValidators[key];
        const rawValue = v[key];

        objectWithValidFields[key as keyof FV] =
          memberValidator.parse(rawValue);
      }
    }

    return objectWithValidFields;
  }

  protected abstract clone(): RequiredOrOptionalObjectValidator;
}

class ObjectValidator<
  FV extends AllFieldValidators,
> extends BaseObjectValidator<FV, ObjectValidator<FV>> {
  parse(v: unknown): ValidatedObjectShape<FV> {
    return this.baseParse(v);
  }

  protected clone() {
    return new ObjectValidator<FV>(this.memberValidators);
  }
}

class OptionalObjectValidator<
  FV extends AllFieldValidators,
> extends BaseObjectValidator<FV, OptionalObjectValidator<FV>> {
  parse(input: unknown): ValidatedObjectShape<FV> | undefined {
    if (input === undefined) return undefined;

    return this.baseParse(input);
  }

  protected clone() {
    return new OptionalObjectValidator<FV>(this.memberValidators);
  }
}

function isStringIndexableObject(input: unknown): input is Record<string, any> {
  return typeof input === 'object' && input !== null;
}

export function object<FV extends AllFieldValidators>(
  memberValidators: FV = {} as FV,
) {
  return new ObjectValidator<FV>(memberValidators);
}
