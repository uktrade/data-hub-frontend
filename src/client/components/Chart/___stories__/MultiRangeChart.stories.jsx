import React from 'react'
import { storiesOf } from '@storybook/react'

import { MultiRangeChart } from '..'

const dataRanges = [
  {
    name: '2020-04-01',
    label: 'Current financial year (2020-21)',
    range: [
      {
        label: 'Prospect',
        id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
        value: 10,
        link: '#',
      },
      {
        label: 'Assigned',
        id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
        value: 3,
        link: '#',
      },
      {
        label: 'Active',
        id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
        value: 5,
        link: '#',
      },
      {
        label: 'Verify win',
        id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
        value: 2,
        link: '#',
      },
      {
        label: 'Won',
        id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
        value: 3,
        link: '#',
      },
    ],
  },
  {
    name: '2019-04-01',
    label: '2019-20',
    range: [
      {
        label: 'Prospect',
        id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
        value: 10,
        link: '#',
      },
      {
        label: 'Assigned',
        id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
        value: 0,
        link: '#',
      },
      {
        label: 'Active',
        id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
        value: 0,
        link: '#',
      },
      {
        label: 'Verify win',
        id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
        value: 1,
        link: '#',
      },
      {
        label: 'Won',
        id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
        value: 23,
        link: '#',
      },
    ],
  },
]

const dataRangesWithZeroValues = [
  {
    name: '2020-04-01',
    label: 'Current financial year (2020-21)',
    range: [
      {
        label: 'Prospect',
        id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
        value: 0,
        link: '#',
      },
      {
        label: 'Assigned',
        id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
        value: 0,
        link: '#',
      },
      {
        label: 'Active',
        id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
        value: 0,
        link: '#',
      },
      {
        label: 'Verify win',
        id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
        value: 0,
        link: '#',
      },
      {
        label: 'Won',
        id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
        value: 0,
        link: '#',
      },
    ],
  },
]

const dataRangesWithNoLinks = [
  {
    name: '2020-04-01',
    label: 'Current financial year (2020-21)',
    range: [
      {
        label: 'Prospect',
        id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
        value: 5,
      },
      {
        label: 'Assigned',
        id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
        value: 2,
      },
      {
        label: 'Active',
        id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
        value: 6,
      },
      {
        label: 'Verify win',
        id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
        value: 1,
      },
      {
        label: 'Won',
        id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
        value: 3,
      },
    ],
  },
]

storiesOf('Chart', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Bar', () => (
    <MultiRangeChart
      title="My project summary"
      subject="Project"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      dataRanges={dataRanges}
    />
  ))
  .add('Bar - no results', () => (
    <MultiRangeChart
      title="My project summary"
      subject="Project"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      dataRanges={dataRangesWithZeroValues}
    />
  ))
  .add('Bar - no links', () => (
    <MultiRangeChart
      title="My project summary"
      subject="Project"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      dataRanges={dataRangesWithNoLinks}
    />
  ))
