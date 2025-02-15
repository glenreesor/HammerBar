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
import { WidgetBuilderParams, WidgetBuildingInfo } from '../mainPanel/types';
import { validateWidgetBuildingInfoArray } from './validateWidgetBuildingInfo';

const goodWidgetBuildingInfo: WidgetBuildingInfo = {
  widgetName: 'a',
  widgetParamErrors: [],
  buildWidget: (_params: WidgetBuilderParams) => ({
    width: 0,
    bringToFront: () => undefined,
    cleanupPriorToDelete: () => undefined,
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

describe('invalid widgetParamErrors types', () => {
  const tests = [
    {
      description: 'fails when widgetParamErrors is a number',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: 1 },
      ],
    },
    {
      description: 'fails when widgetParamErrors is an string',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: 'blarp' },
      ],
    },
    {
      description: 'fails when widgetParamErrors is an object',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: {} },
      ],
    },
    {
      description: 'fails when widgetParamErrors is a function',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: () => '1' },
      ],
    },
    {
      description: 'fails when widgetParamErrors is an array with a number',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: ['a', 1] },
      ],
    },
    {
      description: 'fails when widgetParamErrors is an array with an object',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: ['a', {}] },
      ],
    },
    {
      description: 'fails when widgetParamErrors is an array with an array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: ['a', ['a']] },
      ],
    },
    {
      description: 'fails when widgetParamErrors is an array with a function',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: ['a', () => 'a'] },
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
      description: 'passes when widgetParamErrors is an empty array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: [] },
      ],
    },
    {
      description: 'passes when widgetParamErrors is a non-empty array',
      buildingInfoArray: [
        goodWidgetBuildingInfo,
        { ...goodWidgetBuildingInfo, widgetParamErrors: ['a'] },
      ],
    },
  ];

  test.each(tests)('$description', ({ buildingInfoArray }) => {
    expectPass(buildingInfoArray);
  });
});
