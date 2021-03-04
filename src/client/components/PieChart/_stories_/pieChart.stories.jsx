import React from 'react'
import { storiesOf } from '@storybook/react'
import { stageData } from '../_stories_/pieChartDummyData'
import PieChart from 'PieChart'
import exampleReadme from './example.md'
import usageReadme from './usage.md'

storiesOf('PieChart', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => <PieChart data={stageData} />)
