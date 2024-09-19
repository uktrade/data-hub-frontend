import React from 'react'

import ErrorSummary from '..'

export const errors = [
  {
    targetName: 'national-insurance-number',
    text: 'National Insurance number error',
  },
  {
    targetName: 'description',
    text: 'Description of what you saw error',
  },
]

export default {
  title: 'ErrorSummary',

  parameters: {
    component: ErrorSummary,
  },

  excludeStories: ['errors'],
}

export const Default = () => (
  <ErrorSummary
    heading="Message to alert the user to a problem goes here"
    description="Optional description of the errors and how to correct them"
    errors={errors}
  />
)
