import React from 'react'

import urls from '../../../../../../src/lib/urls'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformEYBLeadToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertEYBLabel,
  assertMetadataItems,
  assertInvestmentThemeLabel,
} from '../../../support/activity-assertions'

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
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertInvestmentThemeLabel()
        assertActivitySubject(LINKED_COMPANY_NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Submitted to EYB date', value: '01 Dec 2024' },
          { label: 'Value', value: 'Unknown' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a lead of high value and linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true, LINKED_COMPANY_NAME)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertInvestmentThemeLabel()
        assertActivitySubject(LINKED_COMPANY_NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Submitted to EYB date', value: '01 Dec 2024' },
          { label: 'Value', value: 'High' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a lead of low value and linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false, LINKED_COMPANY_NAME)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertInvestmentThemeLabel()
        assertActivitySubject(LINKED_COMPANY_NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Submitted to EYB date', value: '01 Dec 2024' },
          { label: 'Value', value: 'Low' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a lead of unknown value and no linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity()
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertInvestmentThemeLabel()
        assertActivitySubject(EYB_COMPANY_NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Submitted to EYB date', value: '01 Dec 2024' },
          { label: 'Value', value: 'Unknown' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a lead of high value and no linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertInvestmentThemeLabel()
        assertActivitySubject(EYB_COMPANY_NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Submitted to EYB date', value: '01 Dec 2024' },
          { label: 'Value', value: 'High' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a lead of low value and no linked company name',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertEYBLabel()
        assertInvestmentThemeLabel()
        assertActivitySubject(EYB_COMPANY_NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Submitted to EYB date', value: '01 Dec 2024' },
          { label: 'Value', value: 'Low' },
        ])
      })
    }
  )
})
