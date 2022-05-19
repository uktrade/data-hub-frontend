import { assertBreadcrumbs } from '../../support/assertions'

const { contacts } = require('../../../../../src/lib/urls')

const selectors = require('../../../../selectors')

describe('Contact Documents', () => {
  context('when there is a document link', () => {
    before(() => {
      cy.visit('/contacts/default-contact-with-document/documents')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Contacts: contacts.index(),
        'Joseph Woof': '/contacts/default-contact-with-document',
        Documents: null,
      })
    })

    it('should not render the Add Interaction button', () => {
      cy.get('[data-test=add-interaction-button]').should('not.exist')
    })

    it('should display appropriate message when there is a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should(
        'contain',
        'View files and documents'
      )
      cy.get(selectors.document.documentContent).should(
        'contain',
        '(will open another website)'
      )
    })
  })

  context('when there is not a document link', () => {
    before(() => {
      cy.visit('/contacts/5555d636-1d24-416a-aaf0-3fb220d59aaa/documents')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Contacts: contacts.index(),
        'Joseph Woof': '/contacts/5555d636-1d24-416a-aaf0-3fb220d59aaa',
        Documents: null,
      })
    })

    it('should not render the Add Interaction button', () => {
      cy.get('[data-test=add-interaction-button]').should('not.exist')
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should(
        'contain',
        'There are no files or documents'
      )
    })
  })

  context('when the activities feature flag is set', () => {
    before(() => {
      cy.setUserFeatures(['user-contact-activities'])
      cy.visit('/contacts/default-contact-with-document/documents')
    })

    it('should display the Add Interaction button in the header', () => {
      cy.get('[data-test=add-interaction-button]').should('exist')
    })

    after(() => {
      cy.resetUser()
    })
  })
})
