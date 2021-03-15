import React from 'react'
import { storiesOf } from '@storybook/react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'
import RoutedInput from '..'

storiesOf('RoutedInput', module)
  .add('Text', () => (
    <div>
      <RoutedInput id="text" qsParam="text" placeholder="text" />
      <ResetQueryStringButton />
    </div>
  ))
  .add('Number', () => (
    <div>
      <RoutedInput
        id="number"
        qsParam="number"
        type="number"
        placeholder="number"
      />
      <ResetQueryStringButton />
    </div>
  ))
