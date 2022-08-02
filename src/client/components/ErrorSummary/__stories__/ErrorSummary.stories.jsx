import React from 'react'
import { storiesOf } from '@storybook/react'

import ErrorSummary from 'ErrorSummary'

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

storiesOf('ErrorSummary', module)
  .addParameters({ component: ErrorSummary })
  .add('Default', () => (
    <ErrorSummary
      heading="Message to alert the user to a problem goes here"
      description="Optional description of the errors and how to correct them"
      errors={errors}
    />
  ))
