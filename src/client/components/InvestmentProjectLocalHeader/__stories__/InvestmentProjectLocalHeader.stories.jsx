import React from 'react'

import InvestmentProjectLocalHeader from '..'

import urls from '../../../../lib/urls'

import {
  STAGE_ACTIVE,
  STAGE_ASSIGN_PM,
  STAGE_PROSPECT,
  STAGE_VERIFY_WIN,
  STAGE_WON,
} from '../../../modules/Investments/Projects/constants'

const investment = {
  id: '123',
  investor_company: {
    name: 'Alphabet Inc.',
    id: '456',
  },
  project_code: 'DHP-00000356',
  value_complete: false,
  created_on: '2022-02-25T15:37:23.331204Z',
  created_by: {
    name: 'Andy Pipkin',
    dit_team: {
      name: 'Little Britain',
    },
  },
  stage: {
    name: STAGE_PROSPECT,
  },
  status: 'ongoing',
}

const breadcrumbs = [
  { link: urls.dashboard.index(), text: 'Home' },
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

export default {
  title: 'InvestmentProjectLocalHeader',

  parameters: {
    component: InvestmentProjectLocalHeader,
  },
}

export const StatusOngoing = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      status: 'ongoing',
    }}
    breadcrumbs={breadcrumbs}
  />
)

StatusOngoing.story = {
  name: 'Status: Ongoing',
}

export const StatusDelayed = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      status: 'delayed',
    }}
    breadcrumbs={breadcrumbs}
  />
)

StatusDelayed.story = {
  name: 'Status: Delayed',
}

export const StatusAbandoned = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      status: 'abandoned',
    }}
    breadcrumbs={breadcrumbs}
  />
)

StatusAbandoned.story = {
  name: 'Status: Abandoned',
}

export const StatusLost = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      status: 'lost',
    }}
    breadcrumbs={breadcrumbs}
  />
)

StatusLost.story = {
  name: 'Status: Lost',
}

export const StatusDormant = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      status: 'dormant',
    }}
    breadcrumbs={breadcrumbs}
  />
)

StatusDormant.story = {
  name: 'Status: Dormant',
}

export const StageProspect = () => (
  <InvestmentProjectLocalHeader
    investment={investment}
    breadcrumbs={breadcrumbs}
  />
)

StageProspect.story = {
  name: 'Stage: Prospect',
}

export const StageAssignPm = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      stage: {
        name: STAGE_ASSIGN_PM,
      },
    }}
    breadcrumbs={breadcrumbs}
  />
)

StageAssignPm.story = {
  name: 'Stage: Assign PM',
}

export const StageActive = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      stage: {
        name: STAGE_ACTIVE,
      },
    }}
    breadcrumbs={breadcrumbs}
  />
)

StageActive.story = {
  name: 'Stage: Active',
}

export const StageVerifyWin = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      stage: {
        name: STAGE_VERIFY_WIN,
      },
    }}
    breadcrumbs={breadcrumbs}
  />
)

StageVerifyWin.story = {
  name: 'Stage: Verify win',
}

export const StageWon = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      stage: {
        name: STAGE_WON,
      },
    }}
    breadcrumbs={breadcrumbs}
  />
)

StageWon.story = {
  name: 'Stage: Won',
}

export const ProjectValuedFalse = () => (
  <InvestmentProjectLocalHeader
    investment={investment}
    breadcrumbs={breadcrumbs}
  />
)

ProjectValuedFalse.story = {
  name: 'Project valued: false',
}

export const ProjectValuedTrue = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      value_complete: true,
    }}
    breadcrumbs={breadcrumbs}
  />
)

ProjectValuedTrue.story = {
  name: 'Project valued: true',
}

export const CreatedByNoDbtTeam = () => (
  <InvestmentProjectLocalHeader
    investment={{
      ...investment,
      created_by: {},
    }}
    breadcrumbs={breadcrumbs}
  />
)

CreatedByNoDbtTeam.story = {
  name: 'Created by: no DBT team',
}
