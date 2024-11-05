import React from 'react'

import StatusMessageHeader from '../'

import { ERROR_COLOUR } from '../../../utils/colours'

export default {
  title: 'StatusMessageHeader',
}

export const Default = () => {
  return <StatusMessageHeader>An info message</StatusMessageHeader>
}

export const CustomColour = () => {
  return (
    <StatusMessageHeader colour={ERROR_COLOUR}>
      An error message
    </StatusMessageHeader>
  )
}

CustomColour.story = {
  name: 'Custom colour',
}
