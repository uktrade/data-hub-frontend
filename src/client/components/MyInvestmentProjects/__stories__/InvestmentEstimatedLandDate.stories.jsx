import React from 'react'
import { storiesOf } from '@storybook/react'

import InvestmentEstimatedLandDate from '../InvestmentEstimatedLandDate'
import exampleReadme from './example.md'
import usageReadme from './usage.md'
import { addDays, subDays, endOfToday } from 'date-fns'

const today = endOfToday()
const futureDate = addDays(today, 100)
const tomorrow = addDays(today, 1)
const twoMonthsAhead = addDays(today, 60)
const pastDate = subDays(today, 10)

storiesOf('InvestmentEstimatedLandDate', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <InvestmentEstimatedLandDate estimatedLandDate={futureDate} />
  ))
  .add('estimatedLandDate is today', () => (
    <InvestmentEstimatedLandDate estimatedLandDate={today} />
  ))
  .add('estimatedLandDate is tomorrow', () => (
    <InvestmentEstimatedLandDate estimatedLandDate={tomorrow} />
  ))
  .add('estimatedLandDate is two months ahead', () => (
    <InvestmentEstimatedLandDate estimatedLandDate={twoMonthsAhead} />
  ))
  .add('estimatedLandDate is in the past', () => (
    <InvestmentEstimatedLandDate estimatedLandDate={pastDate} />
  ))
