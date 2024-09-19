import React from 'react'

import StatusMessage from '..'

import { ERROR_COLOUR } from '../../../../client/utils/colours'

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
