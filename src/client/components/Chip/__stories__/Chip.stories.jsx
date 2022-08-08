import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Chip from '../'

storiesOf('Chips', module)
  .addParameters({ component: Chip })
  .add('Default', () => {
    return (
      <div>
        <Chip value="apple">Apple</Chip>
      </div>
    )
  })
  .add('Clickable', () => {
    return (
      <div>
        <Chip value="apple" onClick={action('Clicked')}>
          Apple
        </Chip>
      </div>
    )
  })
