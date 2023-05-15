import React from 'react'

import { ERROR_COLOUR } from '../../../../client/utils/colours'
import StatusMessage from 'StatusMessage'

export default {
  title: 'StatusMessage',
}

export const Default = () => {
  return <StatusMessage>An info message</StatusMessage>
}

export const CustomColour = () => {
  return <StatusMessage colour={ERROR_COLOUR}>An error message</StatusMessage>
}

CustomColour.story = {
  name: 'Custom colour',
}
