import React from 'react'
import { storiesOf } from '@storybook/react'
import { ERROR_COLOUR } from 'govuk-colours'

import DismissableStatusMessage from '../Dismissable'

storiesOf('DismissableStatusMessage', module)
  .add('Default', () => {
    return <DismissableStatusMessage>An info message</DismissableStatusMessage>
  })
  .add('Custom colour', () => {
    return (
      <DismissableStatusMessage colour={ERROR_COLOUR}>
        An error message
      </DismissableStatusMessage>
    )
  })
