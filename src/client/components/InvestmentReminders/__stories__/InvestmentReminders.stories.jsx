import React from 'react'
import { storiesOf } from '@storybook/react'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

import InvestmentReminders from 'InvestmentReminders'

const adviser = {
  name: 'Paula Churing',
  first_name: 'Paula',
  last_name: 'Churing',
  id: 'adviser-1',
}

const outstandingPropositions = {
  count: 2,
  results: [
    {
      id: '123',
      investment_project: {
        name: 'New restaurant',
        project_code: 'DHP-00000004',
        id: 'project-a',
      },
      adviser,
      deadline: '2021-04-01',
      name: 'Restaurant proposition',
    },
    {
      id: '456',
      investment_project: {
        name: 'Univeristy',
        project_code: 'DHP-00000005',
        id: 'project-b',
      },
      adviser,
      deadline: '2021-04-01',
      name: 'Univeristy proposition',
    },
  ],
}

storiesOf('InvestmentReminders', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <InvestmentReminders
      adviser={adviser}
      outstandingPropositions={outstandingPropositions}
    />
  ))
