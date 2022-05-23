import React from 'react'
import { storiesOf } from '@storybook/react'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

import ReminderSummary from 'ReminderSummary'

const reminderSummary = {
  estimated_land_date: 230,
  no_recent_investment_interaction: 10,
  outstanding_propositions: 5,
}

storiesOf('ReminderSummary', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => <ReminderSummary summary={reminderSummary} />)
