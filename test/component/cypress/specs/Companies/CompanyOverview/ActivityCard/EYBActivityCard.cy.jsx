import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformEYBLeadToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertEYBLabel,
} from '../../../../support/activity-assertions'

const EYB_LEAD_ID = 'e686c9d9-d7ba-444d-a85b-a64c477fc1ba'
const PROJECT_URL = urls.investments.eybLeads.details(EYB_LEAD_ID)
const COMPANY_NAME = 'Booth Sykes'

const buildAndMountActivity = (value = null) => {
  const activity = {
    eyb_lead: {
      is_high_value: value,
      created_on: '2024-12-02T09:59:03.911296+00:00',
      company_name: COMPANY_NAME,
      triage_created: '2024-12-01T09:59:03+00:00',
      id: EYB_LEAD_ID,
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformEYBLeadToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('EYB lead activity card', () => {
  context('When the card is rendered with a lead of unknown value', () => {
    beforeEach(() => {
      buildAndMountActivity()
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertEYBLabel()
      assertActivitySubject(COMPANY_NAME, PROJECT_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `An unknown-value EYB lead associated with this company has been added to Data Hub`
      )
    })
  })

  context('When the card is rendered with a lead of high value', () => {
    beforeEach(() => {
      buildAndMountActivity(true)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertEYBLabel()
      assertActivitySubject(COMPANY_NAME, PROJECT_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `A high-value EYB lead associated with this company has been added to Data Hub`
      )
    })
  })

  context('When the card is rendered with a lead of low value', () => {
    beforeEach(() => {
      buildAndMountActivity(false)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertEYBLabel()
      assertActivitySubject(COMPANY_NAME, PROJECT_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `A low-value EYB lead associated with this company has been added to Data Hub`
      )
    })
  })
})
