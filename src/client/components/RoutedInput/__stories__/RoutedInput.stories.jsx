import React from 'react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'
import RoutedInput from '..'

export default {
  title: 'RoutedInput',
}

export const Text = () => (
  <div>
    <RoutedInput id="text" qsParam="text" placeholder="text" />
    <ResetQueryStringButton />
  </div>
)

export const Number = () => (
  <div>
    <RoutedInput
      id="number"
      qsParam="number"
      type="number"
      placeholder="number"
    />
    <ResetQueryStringButton />
  </div>
)
