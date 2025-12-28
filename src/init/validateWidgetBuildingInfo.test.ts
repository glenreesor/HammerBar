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
import { WidgetLayout, WidgetBuildingInfo } from '../mainPanel/types';
import { validateWidgetBuildingInfoArray } from './validateWidgetBuildingInfo';

const goodWidgetBuildingInfo: WidgetBuildingInfo = {
  widgetName: 'a',
  widgetConfigErrors: [],
  buildWidget: (_params: WidgetLayout) => ({
    width: 0,
    bringToFront: () => undefined,
    prepareForRemoval: () => undefined,
    show: () => undefined,
    hide: () => undefined,
  }),
};

function expectFail(testBuildingInfoArray: unknown) {
  const { isValid, validWidgetBuildingInfoArray } =
    validateWidgetBuildingInfoArray(testBuildingInfoArray);
  expect(isValid).toBe(false);
  expect(validWidgetBuildingInfoArray).toBeUndefined();
}

function expectPass(testBuildingInfoArray: unknown) {
  const { isValid, validWidgetBuildingInfoArray } =
    validateWidgetBuildingInfoArray(testBuildingInfoArray);
  expect(isValid).toBe(true);
  expect(validWidgetBuildingInfoArray).toBe(testBuildingInfoArray);
}

describe('invalid buildingInfoArray types', () => {
  const tests = [
    { description: 'fails when is a number', buildingInfoArray: 1 },
    { description: 'fails when is a string', buildingInfoArray: '1' },
    { description: 'fails when is a function', buildingInfoArray: () => '1' },
  ];

  test.each(tests)('$description', ({ buildingInfoArray }) => {
    expectFail(buildingInfoArray);
  });
});

describe('invalid widgetName types', () => {
  const tests = [
    {
      description: 'fails when widgetName is a number',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetName: 1 },
      ],
    },
    {
      description: 'fails when widgetName is an array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetName: [] },
      ],
    },
    {
      description: 'fails when widgetName is an object',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetName: {} },
      ],
    },
    {
      description: 'fails when widgetName is a function',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetName: () => '1' },
      ],
    },
  ];

  test.each(tests)('$description', ({ buildingInfoArray }) => {
    expectFail(buildingInfoArray);
  });
});

describe('invalid widgetConfigErrors types', () => {
  const tests = [
    {
      description: 'fails when widgetConfigErrors is a number',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: 1 },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is an string',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: 'blarp' },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is an object',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: {} },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is a function',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: () => '1' },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is an array with a number',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: ['a', 1] },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is an array with an object',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: ['a', {}] },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is an array with an array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: ['a', ['a']] },
      ],
    },
    {
      description: 'fails when widgetConfigErrors is an array with a function',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: ['a', () => 'a'] },
      ],
    },
  ];

  test.each(tests)('$description', ({ buildingInfoArray }) => {
    expectFail(buildingInfoArray);
  });
});

describe('invalid buildWidget types', () => {
  const tests = [
    {
      description: 'fails when buildWidget is a number',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, buildWidget: 1 },
      ],
    },
    {
      description: 'fails when buildWidget is an string',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, buildWidget: 'blarp' },
      ],
    },
    {
      description: 'fails when buildWidget is an object',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, buildWidget: {} },
      ],
    },
    {
      description: 'fails when buildWidget is an array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, buildWidget: ['1'] },
      ],
    },
  ];

  test.each(tests)('$description', ({ buildingInfoArray }) => {
    expectFail(buildingInfoArray);
  });
});

describe('valid', () => {
  const tests = [
    {
      description: 'passes when widgetConfigErrors is an empty array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: [] },
      ],
    },
    {
      description: 'passes when widgetConfigErrors is a non-empty array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetConfigErrors: ['a'] },
      ],
    },
  ];

  test.each(tests)('$description', ({ buildingInfoArray }) => {
    expectPass(buildingInfoArray);
  });
});
