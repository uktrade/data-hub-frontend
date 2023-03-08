import React from 'react'
import { storiesOf } from '@storybook/react'

import { ERROR_COLOUR } from '../../../../client/utils/colours'
import DismissableStatusMessage from '../Dismissable'

storiesOf('DismissableStatusMessage', module)
  .addParameters({ component: DismissableStatusMessage })
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
