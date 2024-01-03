import React from 'react'
import { action } from '@storybook/addon-actions'

import Chip from '../'

export default {
  title: 'Chips',

  parameters: {
    component: Chip,
  },
}

export const Default = () => {
  return (
    <div>
      <Chip value="apple">Apple</Chip>
    </div>
  )
}

export const Clickable = () => {
  return (
    <div>
      <Chip value="apple" onClick={action('Clicked')}>
        Apple
      </Chip>
    </div>
  )
}
