import React from 'react'
import { storiesOf } from '@storybook/react'
import PieChart from 'PieChart'
import exampleReadme from './example.md'
import usageReadme from './usage.md'

const stageData = [
  {
    id: 'Prospect',
    label: 'Prospect',
    value: 7,
  },
  {
    id: 'Assign PM',
    label: 'Assign PM',
    value: 2,
  },
  {
    id: 'Active',
    label: 'Active',
    value: 5,
  },
  {
    id: 'Verify win',
    label: 'Verify win',
    value: 2,
  },
  {
    id: 'Won',
    label: 'Won',
    value: 2,
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
  .add('Default', () => <PieChart data={stageData} height={450} />)
