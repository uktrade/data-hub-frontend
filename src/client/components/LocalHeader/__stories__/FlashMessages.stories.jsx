import React from 'react'
import { storiesOf } from '@storybook/react'

import FlashMessages from '../FlashMessages'
import exampleReadme from './example.md'
import usageReadme from './usage.md'

storiesOf('Flash Messages', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FlashMessages
      flashMessages={{
        'success:with-body': [
          {
            heading: 'Success message heading',
            body: 'Success message body',
          },
        ],
        'info:with-body': [
          {
            heading: 'Info message heading',
            body: 'Info message body',
          },
        ],
        error: ['Error test message', 'Another error message'],
        warning: ['Warning test message'],
        muted: ['Muted test message'],
      }}
    />
  ))
