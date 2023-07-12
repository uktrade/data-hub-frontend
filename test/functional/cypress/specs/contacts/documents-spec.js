import { assertBreadcrumbs } from '../../support/assertions'

const { contacts } = require('../../../../../src/lib/urls')

describe('Contact Documents', () => {
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

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get('[data-test=document-header]').should('contain', 'Document')
      cy.get('[data-test=no-documents-message]').should(
        'contain',
        'There are no files or documents'
      )
    })
  })
})
