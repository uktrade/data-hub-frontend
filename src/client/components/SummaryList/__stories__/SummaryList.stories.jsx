import React from 'react'
import { storiesOf } from '@storybook/react'

import SummaryList from 'SummaryList'

const rows = [
  { label: 'Registered company name', value: 'Example Ltd' },
  { label: 'Trading name(s)', value: 'Examples & Tests' },
  {
    label: 'Located at',
    value:
      '99 Loooooooooooooooooooooooooong name Street, London, SE1 456, United Kingdom',
  },
  {
    label: 'Registered address',
    value: '123 Fake Road, London, SE1 123, United Kingdom',
  },
]

storiesOf('SummaryList', module)
  .addParameters({ component: SummaryList })
  .add('Default', () => <SummaryList rows={rows} />)
