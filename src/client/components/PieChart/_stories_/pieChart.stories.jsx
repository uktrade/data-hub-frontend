import React from 'react'
import { storiesOf } from '@storybook/react'
import PieChart from 'PieChart'
import exampleReadme from './example.md'
import usageReadme from './usage.md'

import { PURPLE, ORANGE, BLUE, YELLOW, GREEN } from 'govuk-colours'

const stageData = [
  {
    id: 'Prospect',
    name: 'prospect',
    value: 318,
    colour: PURPLE,
  },
  {
    id: 'Assign PM',
    name: 'assign_pm',
    value: 201,
    colour: ORANGE,
  },
  {
    id: 'Active',
    name: 'active',
    value: 57,
    colour: BLUE,
  },
  {
    id: 'Verify win',
    name: 'verify_win',
    value: 2,
    colour: YELLOW,
  },
  {
    id: 'Won',
    name: 'won',
    value: 21,
    colour: GREEN,
  },
]

storiesOf('PieChart', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <PieChart data={stageData} height={450} unit="Project" />
  ))
