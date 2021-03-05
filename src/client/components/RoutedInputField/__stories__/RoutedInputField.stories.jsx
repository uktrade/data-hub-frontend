import React from 'react'
import { storiesOf } from '@storybook/react'

import { ResetQueryStringButton } from '../../../../../.storybook/utils'

import RoutedInputField from '..'

storiesOf('RoutedInputField', module).add('Default', () => (
  <>
    <RoutedInputField
      label="Example"
      id="example"
      name="example"
      qsParam="example"
      placeholder="example"
    />
    <ResetQueryStringButton />
  </>
))
