import React from 'react'
import { storiesOf } from '@storybook/react'

import SummaryList from 'SummaryList'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

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
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => <SummaryList rows={rows} />)
