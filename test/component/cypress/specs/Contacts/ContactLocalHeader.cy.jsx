import React from 'react'

import ContactLocalHeader from '../../../../../src/client/components/ContactLocalHeader'
import DataHubProvider from '../provider'
import urls from '../../../../../src/lib/urls'

const primaryContact = require('../../../../sandbox/fixtures/v3/contact/contact-complete-details-uk.json')
const archivedContact = require('../../../../sandbox/fixtures/v3/contact/contact-archived.json')
const notPrimaryContact = require('../../../../sandbox/fixtures/v3/contact/contact-incomplete-details-uk.json')

const companyName = primaryContact.company.name
const companyLink = urls.companies.overview.index(primaryContact.company.id)
const contactName = primaryContact.name
const addInteractionUrl = urls.companies.interactions.create(
  primaryContact.company.id
)

describe('ContactLocalHeader', () => {
  const Component = (props) => <ContactLocalHeader {...props} />

  context('When a primary contact is passed in', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component contact={primaryContact} />
        </DataHubProvider>
      )
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
      cy.mount(
        <DataHubProvider>
          <Component contact={notPrimaryContact} />
        </DataHubProvider>
      )
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
      cy.mount(
        <DataHubProvider>
          <Component contact={archivedContact} />
        </DataHubProvider>
      )
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
  })
})

const assertCompanyLink = () => {
  cy.get('[data-test=company-link]')
    .should('exist')
    .should('have.text', companyName)
    .should('have.attr', 'href', companyLink)
}
