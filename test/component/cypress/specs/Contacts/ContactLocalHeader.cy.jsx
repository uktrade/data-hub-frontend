import React from 'react'

import ContactLocalHeader from '../../../../../src/client/components/ContactLocalHeader'
import urls from '../../../../../src/lib/urls'

const notPrimaryContact = require('../../../../sandbox/fixtures/v3/contact/contact-incomplete-details-uk.json')
const primaryContact = require('../../../../sandbox/fixtures/v3/contact/contact-complete-details-uk.json')

const archivedContact = {
  name: 'Joseph Woof',
  company: {
    name: 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978',
    id: '4cd4128b-1bad-4f1e-9146-5d4678c6a018',
  },
  primary: true,
  archived: true,

  archivedOn: '2019-07-04T15:59:14.267412Z',
  archivedReason: 'Left the company',
  archivedBy: {
    name: 'Bernard Harris-Patel',
    first_name: 'Bernard',
    last_name: 'Harris-Patel',
    id: '7d19d407-9aec-4d06-b190-d3f404627f21',
  },
}

const companyName = primaryContact.company.name
const companyLink = urls.companies.overview.index(primaryContact.company.id)
const contactName = primaryContact.name
const addInteractionUrl = urls.companies.interactions.create(
  primaryContact.company.id
)

describe('ContactLocalHeader', () => {
  context('When a primary contact is passed in', () => {
    beforeEach(() => {
      cy.mountWithProvider(<ContactLocalHeader contact={primaryContact} />)
    })

    it('should render the company link', () => {
      assertCompanyLink()
    })

    it('should render the contact name with the primary contact badge', () => {
      cy.get('[data-test=contact-name]')
        .should('exist')
        .contains(contactName)
        .contains('Primary')
    })

    it('should not render the archive panel', () => {
      cy.get('[data-test=archive-panel]').should('not.exist')
    })

    it('should render the Add Interaction button', () => {
      cy.get('[data-test=add-interaction-button]')
        .should('exist')
        .should('have.text', 'Add interaction')
        .should('have.attr', 'href', addInteractionUrl)
    })
  })

  context('When a contact that is not primary is passed in', () => {
    beforeEach(() => {
      cy.mountWithProvider(<ContactLocalHeader contact={notPrimaryContact} />)
    })

    it('should render the company link', () => {
      assertCompanyLink()
    })

    it('should render the contact name without the primary contact badge', () => {
      cy.get('[data-test=contact-name]')
        .should('exist')
        .contains(contactName)
        .should('not.contain', 'Primary')
    })

    it('should render the Add Interaction button', () => {
      cy.get('[data-test=add-interaction-button]')
        .should('exist')
        .should('have.text', 'Add interaction')
        .should('have.attr', 'href', addInteractionUrl)
    })

    it('should not render the archive panel', () => {
      cy.get('[data-test=archive-panel]').should('not.exist')
    })
  })

  context('When an archived contact is passed in', () => {
    beforeEach(() => {
      cy.mountWithProvider(<ContactLocalHeader contact={archivedContact} />)
    })

    it('should render the company link', () => {
      assertCompanyLink()
    })

    it('should render the contact name with the primary contact badge', () => {
      cy.get('[data-test=contact-name]')
        .should('exist')
        .contains(contactName)
        .contains('Primary')
    })

    it('should not render the Add Interaction button', () => {
      cy.get('[data-test=add-interaction-button]').should('not.exist')
    })

    it('should render the archive panel', () => {
      cy.get('[data-test=archive-panel]').should('exist')
    })

    it('should render an archived message', () => {
      cy.get('[data-test="archive-message"]').should(
        'have.text',
        'This contact was archived on 04 Jul 2019 by Bernard Harris-Patel.'
      )
    })

    it('should render an archived reason', () => {
      cy.get('[data-test="archive-reason"]').should(
        'have.text',
        'Reason: Left the company'
      )
    })
  })
})

const assertCompanyLink = () => {
  cy.get('[data-test=company-link]')
    .should('exist')
    .should('have.text', companyName)
    .should('have.attr', 'href', companyLink)
}
