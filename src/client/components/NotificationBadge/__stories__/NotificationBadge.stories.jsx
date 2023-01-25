import React from 'react'
import { storiesOf } from '@storybook/react'

import NotificationBadge from 'NotificationBadge'

storiesOf('NotificationBadge', module)
  .addParameters({ component: NotificationBadge })
  .add('Default', () => <NotificationBadge value={3} />)
