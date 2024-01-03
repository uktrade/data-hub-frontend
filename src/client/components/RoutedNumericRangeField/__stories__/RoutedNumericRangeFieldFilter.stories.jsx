import React from 'react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'
import RoutedNumericRangeFieldFilter from '../Filter'

export default {
  title: 'RoutedNumericRangeField',

  parameters: {
    component: RoutedNumericRangeFieldFilter,
  },
}

export const Filter = () => (
  <div>
    <RoutedNumericRangeFieldFilter
      label="Label"
      id="example"
      name="example"
      qsParam="example"
      placeholder="example"
    />
    <ResetQueryStringButton />
  </div>
)
