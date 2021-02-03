import React from 'react'
import { storiesOf } from '@storybook/react'

import Timeline from 'Timeline'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

storiesOf('Timeline', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <Timeline
      stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
    />
  ))
  .add('First stage', () => (
    <Timeline
      stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
      currentStage="Prospect"
    />
  ))
  .add('Complete', () => (
    <Timeline
      stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
      currentStage="Won"
    />
  ))
