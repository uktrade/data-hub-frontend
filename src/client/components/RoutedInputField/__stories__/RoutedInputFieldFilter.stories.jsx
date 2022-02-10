import React from 'react'
import { storiesOf } from '@storybook/react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'

import RoutedInputFieldFilter from '../Filter'

storiesOf('RoutedInputField', module).add('Filter', () => (
  <>
    <RoutedInputFieldFilter
      label="Example"
      id="example"
      name="example"
      qsParam="example"
      placeholder="example"
    />
    <ResetQueryStringButton />
  </>
))
