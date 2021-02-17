import React from 'react'
import { storiesOf } from '@storybook/react'

import ErrorSummary from 'ErrorSummary'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

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
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <ErrorSummary
      heading="Message to alert the user to a problem goes here"
      description="Optional description of the errors and how to correct them"
      errors={errors}
    />
  ))
