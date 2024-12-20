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
const EYB_COMPANY_NAME = 'EYB Company Name'
const LINKED_COMPANY_NAME = 'Linked Company Name'

const buildAndMountActivity = (value = null, linked_company_name = null) => {
  const activity = {
    company: {
      name: linked_company_name,
    },
    eyb_lead: {
      is_high_value: value,
      created_on: '2024-12-02T09:59:03.911296+00:00',
      company_name: EYB_COMPANY_NAME,
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
  context(
    'When the card is rendered with a lead of unknown value and linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(null, LINKED_COMPANY_NAME)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertActivitySubject(
          LINKED_COMPANY_NAME,
          PROJECT_URL,
          'activity-card-wrapper'
        )
        cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `An unknown-value EYB lead associated with this company has been added to Data Hub`
        )
      })
    }
  )

  context(
    'When the card is rendered with a lead of high value and linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true, LINKED_COMPANY_NAME)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertActivitySubject(
          LINKED_COMPANY_NAME,
          PROJECT_URL,
          'activity-card-wrapper'
        )
        cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `A high-value EYB lead associated with this company has been added to Data Hub`
        )
      })
    }
  )

  context(
    'When the card is rendered with a lead of low value and linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false, LINKED_COMPANY_NAME)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertActivitySubject(
          LINKED_COMPANY_NAME,
          PROJECT_URL,
          'activity-card-wrapper'
        )
        cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `A low-value EYB lead associated with this company has been added to Data Hub`
        )
      })
    }
  )

  context(
    'When the card is rendered with a lead of unknown value and no linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity()
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertActivitySubject(
          EYB_COMPANY_NAME,
          PROJECT_URL,
          'activity-card-wrapper'
        )
        cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `An unknown-value EYB lead associated with this company has been added to Data Hub`
        )
      })
    }
  )

  context(
    'When the card is rendered with a lead of high value and no linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertActivitySubject(
          EYB_COMPANY_NAME,
          PROJECT_URL,
          'activity-card-wrapper'
        )
        cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `A high-value EYB lead associated with this company has been added to Data Hub`
        )
      })
    }
  )

  context(
    'When the card is rendered with a lead of low value and no linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertActivitySubject(
          EYB_COMPANY_NAME,
          PROJECT_URL,
          'activity-card-wrapper'
        )
        cy.get('[data-test="activity-date"]').should('have.text', '02 Dec 2024')
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `A low-value EYB lead associated with this company has been added to Data Hub`
        )
      })
    }
  )
})
