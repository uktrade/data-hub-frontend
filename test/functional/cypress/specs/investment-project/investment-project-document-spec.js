const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors')

describe('Investment Project Documents', () => {
  it('should display appropriate message when there is a link to a document', () => {
    cy.visit(`/investments/projects/${fixtures.investment.investmentWithLink.id}/documents`)

    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.documentContent).should('contain', 'View files and documents')
    cy.get(selectors.document.documentContent).should('contain', '(will open another website)')
  })

  it('should display appropriate message when there is not a link to a document', () => {
    cy.visit(`/investments/projects/${fixtures.investment.investmentWithNoLink.id}/documents`)
    cy.get(selectors.document.documentHeader).should('contain', 'Document')
    cy.get(selectors.document.documentContent).should(
      'contain', 'There are no files or documents')
  })
})
