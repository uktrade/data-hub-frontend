import React from 'react'
import { storiesOf } from '@storybook/react'

import Chart from 'Chart'

storiesOf('Chart', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Bar', () => (
    <Chart
      title="My project summary"
      sortName="sortBy"
      sortLabel="Date range"
      sortOptions={[
        { label: 'Current financial year', value: '1' },
        { label: '2019-2020', value: '2' },
      ]}
      subject="Projects"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      name="stage"
      url="/investments/projects"
      data={[
        {
          key: 'Prospect',
          param: 1,
          value: 7,
        },
        {
          key: 'Assigned',
          param: 2,
          value: 20,
        },
        {
          key: 'Active',
          param: 3,
          value: 5,
        },
        {
          key: 'Verfiy win',
          param: 4,
          value: 2,
        },
        {
          key: 'Won',
          param: 5,
          value: 15,
        },
      ]}
    />
  ))
  .add('Bar - no results', () => (
    <Chart
      title="My project summary"
      sortName="sortBy"
      sortLabel="Date range"
      sortOptions={[
        { label: 'Current financial year', value: '1' },
        { label: '2019-2020', value: '2' },
      ]}
      subject="Projects"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      name="stage"
      url="/investments/projects"
      data={[
        {
          key: 'Prospect',
          param: 1,
          value: 0,
        },
        {
          key: 'Assigned',
          param: 2,
          value: 0,
        },
        {
          key: 'Active',
          param: 3,
          value: 0,
        },
        {
          key: 'Verfiy win',
          param: 4,
          value: 0,
        },
        {
          key: 'Won',
          param: 5,
          value: 0,
        },
      ]}
    />
  ))
