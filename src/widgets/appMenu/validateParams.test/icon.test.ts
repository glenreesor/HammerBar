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

import { describe, test } from 'vitest';
import type { ConfigParams } from '../types';
import { expectFail, expectPass } from './util';

const goodAppEntry: ConfigParams['appList'][number] = {
  bundleId: 'bundle ID',
  label: 'my label',
};

test('passes when icon is missing', () => {
  const testParams = { appList: [goodAppEntry], icon: undefined };
  expectPass(testParams);
});

describe('invalid icon type', () => {
  const tests = [
    { description: 'fails when icon is a number', icon: 1 },
    { description: 'fails when icon is an array', icon: ['bob'] },
    { description: 'fails when icon is a string', icon: '' },
    { description: 'fails when icon is a function', icon: () => 1 },
  ];

  test.each(tests)('$description', ({ icon }) => {
    const testParams = {
      appList: [goodAppEntry],
      icon,
    };
    expectFail(testParams);
  });
});

describe('invalid bundleId', () => {
  const tests = [
    { description: 'fails when bundleId is a number', bundleId: 1 },
    { description: 'fails when bundleId is an array', bundleId: ['bob'] },
    { description: 'fails when bundleId is an object', bundleId: {} },
    { description: 'fails when bundleId is a function', bundleId: () => 1 },
  ];

  test.each(tests)('$description', ({ bundleId }) => {
    const testParams = {
      appList: [goodAppEntry],
      icon: {
        bundleId,
        imagePath: undefined,
      },
    };
    expectFail(testParams);
  });
});

describe('invalid imagePath', () => {
  const tests = [
    { description: 'fails when imagePath is a number', imagePath: 1 },
    { description: 'fails when imagePath is an array', imagePath: ['bob'] },
    { description: 'fails when imagePath is an object', imagePath: {} },
    { description: 'fails when imagePath is a function', imagePath: () => 1 },
  ];

  test.each(tests)('$description', ({ imagePath }) => {
    const testParams = {
      appList: [goodAppEntry],
      icon: {
        bundleId: undefined,
        imagePath,
      },
    };
    expectFail(testParams);
  });
});

test('fails when bundleId and imagePath are both present', () => {
  const testParams = {
    appList: [goodAppEntry],
    icon: {
      bundleId: 'bundleId',
      imagePath: 'imagePath',
    },
  };
  expectFail(testParams);
});
