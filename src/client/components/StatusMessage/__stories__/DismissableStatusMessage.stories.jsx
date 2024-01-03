import React from 'react'

import { ERROR_COLOUR } from '../../../../client/utils/colours'
import DismissableStatusMessage from '../Dismissable'

export default {
  title: 'DismissableStatusMessage',

  parameters: {
    component: DismissableStatusMessage,
  },
}

export const Default = () => {
  return <DismissableStatusMessage>An info message</DismissableStatusMessage>
}

export const CustomColour = () => {
  return (
    <DismissableStatusMessage colour={ERROR_COLOUR}>
      An error message
    </DismissableStatusMessage>
  )
}

CustomColour.story = {
  name: 'Custom colour',
}
