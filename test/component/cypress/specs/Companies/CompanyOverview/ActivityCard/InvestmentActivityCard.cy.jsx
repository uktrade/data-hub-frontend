import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformInvestmentToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertProjectKindLabel,
} from '../../../../support/activity-assertions'

const NAME = 'An investment project'
const PROJECT_URL = urls.investments.projects.details('2')
const CREATED_ON = '2058-11-25T00:00:00Z'

const CREATED_BY = {
  email: 'bernardharrispatel@test.com',
  name: 'Bernard Harris-Patel',
  dit_team: {
    name: 'Test Team 1',
  },
}

const buildAndMountActivity = (newJobs) => {
  const activity = {
    date: CREATED_ON,
    investment: {
      id: '2',
      created_by: CREATED_BY,
      name: NAME,
      investment_type: {
        name: 'FDI',
      },
      number_new_jobs: newJobs,
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformInvestmentToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('Investment activity card', () => {
  context('When the card is rendered with a complete project', () => {
    beforeEach(() => {
      buildAndMountActivity(2)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertProjectKindLabel()
      assertActivitySubject(NAME, PROJECT_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `FDI investment for 2 new jobs added by ${CREATED_BY.name}`
      )
    })
  })

  context('When the project has one new job', () => {
    beforeEach(() => {
      buildAndMountActivity(1)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertProjectKindLabel()
      assertActivitySubject(NAME, PROJECT_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `FDI investment for 1 new job added by ${CREATED_BY.name}`
      )
    })
  })

  context('When the project has no new jobs', () => {
    beforeEach(() => {
      buildAndMountActivity(0)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertProjectKindLabel()
      assertActivitySubject(NAME, PROJECT_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `FDI investment for no new jobs added by ${CREATED_BY.name}`
      )
    })
  })
})