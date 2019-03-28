const selectors = require('../../selectors')

describe('Investment Project Documents', () => {
  it('should display appropriate message when there is a link to a document', () => {
    cy.visit('/investments/projects/fb5b5006-56af-40e0-8615-7aba53e0e4bf/documents')

    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.documentContent).should('contain', 'View files and documents')
    cy.get(selectors.document.documentContent).should('contain', '(will open another website)')
  })

  it('should display appropriate message when there is not a link to a document', () => {
    cy.visit('/investments/projects/addca042-5a00-412c-9d7c-acc04552756c/documents')
    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.documentContent).should(
      'contain', 'There are no files or documents')
  })
})
