const selectors = require('../../selectors')

describe('Contact Documents', () => {
  it('should display appropriate message when there is a link to a document', () => {
    cy.visit('/contacts/default-contact-with-document/documents')

    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.documentContent).should('contain', 'View files and documents')
    cy.get(selectors.document.documentContent).should('contain', '(will open another website)')
  })

  it('should display appropriate message when there is not a link to a document', () => {
    cy.visit('/contacts/5555d636-1d24-416a-aaf0-3fb220d59aaa/documents')
    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.documentContent).should(
      'contain', 'There are no files or documents')
  })
})
