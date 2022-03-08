import React from 'react'
import { storiesOf } from '@storybook/react'

import InvestmentProjectLocalHeader from 'InvestmentProjectLocalHeader'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'
import urls from '../../../../lib/urls'

const investment = {
  id: '123',
  investor_company: {
    name: 'Alphabet Inc.',
    id: '456',
  },
  project_code: 'DHP-00000356',
  value_complete: false,
  created_on: '2022-02-25T15:37:23.331204Z',
  stage: {
    name: 'Prospect',
  },
  status: 'ongoing',
}

const breadcrumbs = [
  { link: urls.dashboard(), text: 'Home' },
  {
    link: urls.investments.index(),
    text: 'Investments',
  },
  {
    link: urls.investments.index(),
    text: 'Projects',
  },
  {
    link: urls.investments.projects.details(investment.id),
    text: investment.investor_company.name,
  },
]

storiesOf('InvestmentProjectLocalHeader', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Status: Ongoing', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        status: 'ongoing',
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Status: Delayed', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        status: 'delayed',
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Status: Abandoned', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        status: 'abandoned',
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Status: Lost', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        status: 'lost',
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Status: Dormant', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        status: 'dormant',
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Stage: Prospect', () => (
    <InvestmentProjectLocalHeader
      investment={investment}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Stage: Assign PM', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        stage: {
          name: 'Assign PM',
        },
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Stage: Active', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        stage: {
          name: 'Active',
        },
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Stage: Verify win', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        stage: {
          name: 'Verify win',
        },
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Stage: Won', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        stage: {
          name: 'Won',
        },
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Project valued: false', () => (
    <InvestmentProjectLocalHeader
      investment={investment}
      breadcrumbs={breadcrumbs}
    />
  ))
  .add('Project valued: true', () => (
    <InvestmentProjectLocalHeader
      investment={{
        ...investment,
        value_complete: true,
      }}
      breadcrumbs={breadcrumbs}
    />
  ))
