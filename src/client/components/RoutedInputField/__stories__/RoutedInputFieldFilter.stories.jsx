import React from 'react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'
import RoutedInputFieldFilter from '../Filter'

export default {
  title: 'RoutedInputField',

  parameters: {
    component: RoutedInputFieldFilter,
  },
}

export const Filter = () => (
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
)
