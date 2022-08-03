import React from 'react'
import { storiesOf } from '@storybook/react'

import Timeline from 'Timeline'

storiesOf('Timeline', module)
  .addParameters({ component: Timeline })
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
