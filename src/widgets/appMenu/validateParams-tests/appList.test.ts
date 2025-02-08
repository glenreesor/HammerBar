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

import { describe, expect, test } from 'vitest';
import { validateParams } from '../validateParams';

const goodAppEntry = { bundleId: 'bundle ID', label: 'my label' };

describe('valid appList', () => {
  test('passes when appList has one element', () => {
    const testParams = {
      appList: [goodAppEntry],
    };
    const { isValid, validParams, expectedArgument } =
      validateParams(testParams);

    expect(isValid).toBe(true);
    expect(validParams).toBe(testParams);
    expect(expectedArgument?.length).toBeUndefined;
  });

  test('passes when appList has multiple elements', () => {
    const testParams = {
      appList: [goodAppEntry, goodAppEntry],
    };
    const { isValid, validParams, expectedArgument } =
      validateParams(testParams);

    expect(isValid).toBe(true);
    expect(validParams).toBe(testParams);
    expect(expectedArgument?.length).toBeUndefined;
  });
});

describe('invalid appList', () => {
  const tests = [
    { description: 'fails when missing', testParams: {} },
    { description: 'fails when is a number', testParams: { appList: 1 } },
    { description: 'fails when is a string', testParams: { appList: '1' } },
    {
      description: 'fails when is an empty array',
      testParams: { appList: [] },
    },
    {
      description: 'fails when there are extra keys',
      testParams: {
        appList: [
          goodAppEntry,
          { bundleId: 'bundle id', label: 'my label', extra: 'extra' },
        ],
      },
    },
  ];

  const bundleIdTests = [
    {
      description: 'fails when bundleId is a number',
      testParams: {
        appList: [goodAppEntry, { bundleId: 1, label: 'my label' }],
      },
    },
    {
      description: 'fails when bundleId is a array',
      testParams: {
        appList: [goodAppEntry, { bundleId: ['1'], label: 'my label' }],
      },
    },
    {
      description: 'fails when bundleId is an object',
      testParams: {
        appList: [goodAppEntry, { bundleId: {}, label: 'my label' }],
      },
    },
    {
      description: 'fails when bundleId missing in some entries',
      testParams: { appList: [goodAppEntry, { label: 'my label' }] },
    },
  ];

  const labelTests = [
    {
      description: 'fails when label is a number',
      testParams: {
        appList: [goodAppEntry, { bundleId: 'bundle ID', label: 1 }],
      },
    },
    {
      description: 'fails when label is a array',
      testParams: {
        appList: [goodAppEntry, { bundleId: 'bundle ID', label: ['my label'] }],
      },
    },
    {
      description: 'fails when label is an object',
      testParams: {
        appList: [goodAppEntry, { bundleId: 'bundle ID', label: [] }],
      },
    },
    {
      description: 'fails when label missing in some entries',
      testParams: { appList: [goodAppEntry, { bundleId: 'bob' }] },
    },
  ];

  test.each([...tests, ...bundleIdTests, ...labelTests])(
    '$description',
    ({ testParams }) => {
      const { isValid, validParams, expectedArgument } =
        validateParams(testParams);

      expect(isValid).toBe(false);
      expect(validParams).toBeUndefined();
      expect(expectedArgument?.length).toBeGreaterThan(0);
    },
  );
});
