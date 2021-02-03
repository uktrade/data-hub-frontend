import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import Chart from 'Chart'

const apiResponseWithValues = [
  {
    date: '2021',
    results: [
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
        key: 'Verify win',
        param: 4,
        value: 2,
      },
      {
        key: 'Won',
        param: 5,
        value: 15,
      },
    ],
  },
  {
    date: '2020',
    results: [
      {
        key: 'Prospect',
        param: 1,
        value: 10,
      },
      {
        key: 'Assigned',
        param: 2,
        value: 30,
      },
      {
        key: 'Active',
        param: 3,
        value: 4,
      },
      {
        key: 'Verify win',
        param: 4,
        value: 27,
      },
      {
        key: 'Won',
        param: 5,
        value: 80,
      },
    ],
  },
]

const apiResponseZeroValues = [
  {
    date: '2021',
    results: [
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
    ],
  },
]

const InvestmentProjectsChart = ({ data }) => {
  const [projectsData, setProjectsData] = useState(data[0])

  const onChange = (e) => {
    const [selectedProjects] = data.filter(
      ({ date }) => date === e.target.value
    )
    setProjectsData(selectedProjects)
  }

  return (
    <Chart
      title="My project summary"
      sortName="sortBy"
      sortLabel="Date range"
      sortOptions={[
        { label: 'Current financial year', value: '2021' },
        { label: '2019-2020', value: '2020' },
      ]}
      subject="Projects"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      name="stage"
      url="/investments/projects"
      onChange={onChange}
      data={projectsData}
    />
  )
}

storiesOf('Chart', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Bar', () => <InvestmentProjectsChart data={apiResponseWithValues} />)
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
      data={apiResponseZeroValues[0]}
    />
  ))
