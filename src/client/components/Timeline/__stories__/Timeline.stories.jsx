import React from 'react'

import Timeline from '..'

import {
  INVESTMENT_PROJECT_STAGES,
  STAGE_PROSPECT,
  STAGE_WON,
} from '../../../modules/Investments/Projects/constants'

export default {
  title: 'Timeline',

  parameters: {
    component: Timeline,
  },
}

export const Default = () => <Timeline stages={INVESTMENT_PROJECT_STAGES} />

export const FirstStage = () => (
  <Timeline stages={INVESTMENT_PROJECT_STAGES} currentStage={STAGE_PROSPECT} />
)

FirstStage.story = {
  name: 'First stage',
}

export const Complete = () => (
  <Timeline stages={INVESTMENT_PROJECT_STAGES} currentStage={STAGE_WON} />
)
