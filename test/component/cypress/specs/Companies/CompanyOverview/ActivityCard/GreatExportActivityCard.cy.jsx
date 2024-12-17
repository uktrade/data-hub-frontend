import React from 'react'

import { transformGreatExportEnquiryToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import { assertGreatKindLabel } from '../../../../support/activity-assertions'
import {
  CONTACT_1,
  CREATED_ON,
  EMPTY_CONTACT,
} from '../../../../support/activity-constants'

const SUBJECT = 'Lorem ipsum dolor'
const LONG_NOTES =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.'

const buildAndMountActivity = (showOptionalFields, subject = SUBJECT) => {
  const activity = {
    date: CREATED_ON,
    great_export_enquiry: {
      id: '2',
      contact: showOptionalFields ? CONTACT_1 : EMPTY_CONTACT,
      meta_subject: subject,
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformGreatExportEnquiryToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('Great activity card', () => {
  context('When the card is rendered with a complete enquiry', () => {
    beforeEach(() => {
      buildAndMountActivity(true)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertGreatKindLabel()
      cy.get(`[data-test="activity-card-wrapper"]`)
        .find('h3')
        .children()
        .should('exist')
        .should('have.text', SUBJECT)
        .should('not.have.attr', 'href')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Enquirer Alexander Hamilton'
      )
    })
  })

  context('When the enquiry subject is over 35 characters', () => {
    beforeEach(() => {
      buildAndMountActivity(true, LONG_NOTES)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the truncated label', () => {
      assertGreatKindLabel()
      cy.get(`[data-test="activity-card-wrapper"]`)
        .find('h3')
        .children()
        .should('exist')
        .should('have.text', 'Lorem ipsum dolor sit amet, ...')
        .should('not.have.attr', 'href')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Enquirer Alexander Hamilton'
      )
    })
  })

  context('When the contact is blank', () => {
    beforeEach(() => {
      buildAndMountActivity(false)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the truncated label', () => {
      assertGreatKindLabel()
      cy.get(`[data-test="activity-card-wrapper"]`)
        .find('h3')
        .children()
        .should('exist')
        .should('have.text', SUBJECT)
        .should('not.have.attr', 'href')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Unknown enquirer'
      )
    })
  })
})
