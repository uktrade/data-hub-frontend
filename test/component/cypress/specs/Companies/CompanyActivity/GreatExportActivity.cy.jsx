import React from 'react'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformGreatExportEnquiryToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertMetadataItems,
  assertGreatKindLabel,
  assertText,
} from '../../../support/activity-assertions'
import {
  CONTACT_1,
  CREATED_BY,
  CREATED_ON,
  EMPTY_CONTACT,
} from '../../../support/activity-constants'

const SUBJECT = 'Lorem ipsum dolor'
const NOTES =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
const LONG_NOTES =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.'

const buildAndMountActivity = (
  showOptionalFields,
  notes = NOTES,
  subject = SUBJECT
) => {
  const activity = {
    date: CREATED_ON,
    great_export_enquiry: {
      id: '2',
      contact: showOptionalFields ? CONTACT_1 : EMPTY_CONTACT,
      data_enquiry: showOptionalFields ? notes : '',
      meta_subject: subject,
      meta_email_address: showOptionalFields ? CREATED_BY.email : '',
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformGreatExportEnquiryToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('Great Export Enquiry activity card', () => {
  context('When the card is rendered with a complete enquiry', () => {
    beforeEach(() => {
      buildAndMountActivity(true)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertGreatLabels()
      cy.get(`[data-test="collection-item"]`)
        .find('h2')
        .children()
        .should('exist')
        .should('have.text', `Enquiry ${SUBJECT}`)
        .should('not.have.attr', 'href')

      const itemLabels = '[data-test="metadata-label"]'
      cy.get(itemLabels).should('have.length', 4)
      cy.get(itemLabels).eq(0).should('have.text', 'Date')
      cy.get(itemLabels).eq(1).should('have.text', 'Contact')
      cy.get(itemLabels).eq(2).should('have.text', 'Job title')
      cy.get(itemLabels).eq(3).should('have.text', 'Email')

      const itemValues = '[data-test="metadata-value"]'
      cy.get(itemValues).should('have.length', 5)
      cy.get(itemValues).eq(0).should('have.text', `${NOTES}`)
      cy.get(itemValues).eq(1).should('have.text', '25 Nov 2058')
      cy.get(itemValues).eq(2).should('have.text', 'Alexander Hamilton')
      cy.get(itemValues).eq(3).should('have.text', 'Test Job')
      cy.get(itemValues)
        .eq(4)
        .should('have.text', 'bernardharrispatel@test.com')
    })
  })

  context('When the enquiry has missing fields', () => {
    beforeEach(() => {
      buildAndMountActivity(false)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the date and the labels', () => {
      assertGreatLabels()
      assertMetadataItems([{ label: 'Date', value: '25 Nov 2058' }])
    })
  })

  context('When the enquiry has a long name and notes', () => {
    beforeEach(() => {
      buildAndMountActivity(true, LONG_NOTES, LONG_NOTES)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should truncate the long fields', () => {
      assertGreatLabels()
      cy.get(`[data-test="collection-item"]`)
        .find('h2')
        .children()
        .should('exist')
        .should('have.text', 'Enquiry Lorem ipsum dolor sit amet, ...')
        .should('not.have.attr', 'href')

      const itemLabels = '[data-test="metadata-label"]'
      cy.get(itemLabels).should('have.length', 4)
      cy.get(itemLabels).eq(0).should('have.text', 'Date')
      cy.get(itemLabels).eq(1).should('have.text', 'Contact')
      cy.get(itemLabels).eq(2).should('have.text', 'Job title')
      cy.get(itemLabels).eq(3).should('have.text', 'Email')

      const itemValues = '[data-test="metadata-value"]'
      cy.get(itemValues).should('have.length', 5)
      cy.get(itemValues)
        .eq(0)
        .should(
          'have.text',
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ...'
        )
      cy.get(itemValues).eq(1).should('have.text', '25 Nov 2058')
      cy.get(itemValues).eq(2).should('have.text', 'Alexander Hamilton')
      cy.get(itemValues).eq(3).should('have.text', 'Test Job')
      cy.get(itemValues)
        .eq(4)
        .should('have.text', 'bernardharrispatel@test.com')
    })
  })
})

const assertGreatLabels = () => {
  assertText('[data-test="great-theme-label"]', 'great.gov.uk Enquiry')
  assertText('[data-test="great-service-label"]', 'Export')
  assertGreatKindLabel()
}
