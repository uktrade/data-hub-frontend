const selectors = require('../../selectors')

describe('Company interaction', () => {
  beforeEach(() => {
    cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions')
  })

  it('Hide add interaction for archived companies', () => {
    cy.get(selectors.companyInteraction.add).should('not.be.visible')
    cy.get(selectors.companyInteraction.header).should('be.visible')

    cy.get(selectors.companyInteraction.header).should('contain', 'Company interactions')
    cy.get(selectors.companyInteraction.archivedMsg).should(
      'contain', 'Why can I not add an interaction?')
  })
})
