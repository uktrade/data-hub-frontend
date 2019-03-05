const selectors = require('../../selectors')

describe('Company interaction', () => {
  beforeEach(() => {
    cy.visit('/companies/4cd4128b-1bad-4f1e-9146-5d4678c6a018/interactions')
  })

  it('Hide add interaction for archived companies', () => {
    console.log(selectors)
    cy.get(selectors.companyInteraction.add).should('not.be.visible')
    cy.get(selectors.companyInteraction.header).should('be.visible')

    cy.get(selectors.companyInteraction.header).should('contain', 'Company interactions')
    cy.get(selectors.companyInteraction.archivedMsg).should(
      'contain', 'Why can I not add an interaction?')
  })
})
