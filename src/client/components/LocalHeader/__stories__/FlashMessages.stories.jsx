import React from 'react'

import FlashMessages from '../FlashMessages'

export default {
  title: 'Flash Messages',

  parameters: {
    component: FlashMessages,
  },
}

export const Default = () => (
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
)
