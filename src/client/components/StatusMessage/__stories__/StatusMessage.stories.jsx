import React from 'react'
import { storiesOf } from '@storybook/react'

import { ERROR_COLOUR } from '../../../../client/utils/colours'
import StatusMessage from 'StatusMessage'

storiesOf('StatusMessage', module)
  .add('Default', () => {
    return <StatusMessage>An info message</StatusMessage>
  })
  .add('Custom colour', () => {
    return <StatusMessage colour={ERROR_COLOUR}>An error message</StatusMessage>
  })
