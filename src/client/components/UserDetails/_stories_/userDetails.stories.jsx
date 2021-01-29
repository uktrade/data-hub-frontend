import React from 'react'
import { storiesOf } from '@storybook/react'

import UserDetails from 'UserDetails'
import exampleReadme from './example.md'
import usageReadme from './usage.md'
import { endOfToday } from 'date-fns'

const today = endOfToday()

const sampleTeam = {
  name: 'CRM Data',
  country: {
    name: 'United Kingdom',
  },
}

storiesOf('UserDetails', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <UserDetails
      name={'User Name'}
      last_login={today}
      dit_team={sampleTeam}
      job_title={'Developer'}
    />
  ))
