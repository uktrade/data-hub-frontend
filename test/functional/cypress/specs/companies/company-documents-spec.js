const selectors = require('../../selectors')

describe('Company Documents', () => {
  it('should display appropriate message when there is a link to a document', () => {
    cy.visit('/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/documents')

    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.document).should('contain', 'View files and documents')
    cy.get(selectors.document.document).should('contain', '(will open another website)')
  })

  it('should display appropriate message when there is not a link to a document', () => {
    cy.visit('/companies/document-with-no-link/documents')
    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.document).should(
      'contain', 'There are no files or documents')
  })
})
