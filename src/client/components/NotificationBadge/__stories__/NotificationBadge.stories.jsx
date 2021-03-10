import React from 'react'
import { storiesOf } from '@storybook/react'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

import NotificationBadge from 'NotificationBadge'

storiesOf('NotificationBadge', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => <NotificationBadge label={3} />)
