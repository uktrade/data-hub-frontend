import React from 'react'

import SummaryList from '..'

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

export default {
  title: 'SummaryList',

  parameters: {
    component: SummaryList,
  },
}

export const Default = () => <SummaryList rows={rows} />
