import React from 'react'

import StatusMessageHeader from '../'

import { GREEN, RED } from '../../../utils/colours'

export default {
  title: 'StatusMessageHeader',
}

export const Default = () => {
  return <StatusMessageHeader>An info message</StatusMessageHeader>
}

export const CustomColour = () => {
  return (
    <StatusMessageHeader borderColour={RED} textColour={GREEN}>
      A status message in the header with a red border and green text
    </StatusMessageHeader>
  )
}

CustomColour.story = {
  name: 'Custom colour',
}
