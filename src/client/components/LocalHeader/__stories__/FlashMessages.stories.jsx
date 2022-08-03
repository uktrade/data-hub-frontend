import React from 'react'
import { storiesOf } from '@storybook/react'

import FlashMessages from '../FlashMessages'

storiesOf('Flash Messages', module)
  .addParameters({ component: FlashMessages })
  .add('Default', () => (
    <FlashMessages
      flashMessages={{
        success: ['Success message'],
        'success:with-body': [
          {
            heading: 'Success message heading',
            body: 'Success message body',
          },
        ],
        info: ['Info message'],
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
