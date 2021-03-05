import React from 'react'
import { storiesOf } from '@storybook/react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'
import RoutedNumericRangeField from '..'

storiesOf('RoutedNumericRangeField', module).add('Default', () => (
  <div>
    <RoutedNumericRangeField
      label="Label"
      id="example"
      name="example"
      qsParam="example"
      placeholder="example"
    />
    <ResetQueryStringButton />
  </div>
))
