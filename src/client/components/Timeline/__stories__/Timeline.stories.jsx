import React from 'react'

import Timeline from 'Timeline'

export default {
  title: 'Timeline',

  parameters: {
    component: Timeline,
  },
}

export const Default = () => (
  <Timeline stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']} />
)

export const FirstStage = () => (
  <Timeline
    stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
    currentStage="Prospect"
  />
)

FirstStage.story = {
  name: 'First stage',
}

export const Complete = () => (
  <Timeline
    stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
    currentStage="Won"
  />
)
