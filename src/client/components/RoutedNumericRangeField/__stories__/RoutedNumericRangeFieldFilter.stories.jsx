import React from 'react'
import { storiesOf } from '@storybook/react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'
import RoutedNumericRangeFieldFilter from '../Filter'

storiesOf('RoutedNumericRangeField', module).add('Filter', () => (
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
))
