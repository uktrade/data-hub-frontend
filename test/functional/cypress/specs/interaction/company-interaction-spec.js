const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors')

describe('Company interaction', () => {
  beforeEach(() => {
    cy.visit(`/companies/${fixtures.company.archivedLtd.id}/interactions`)
  })

  it('Hide add interaction for archived companies', () => {
    cy.get(selectors.companyInteraction().addButton(fixtures.company.archivedLtd.id)).should('not.be.visible')
    cy.get(selectors.companyInteraction().heading).should('be.visible')

    cy.get(selectors.companyInteraction().heading).should('contain', 'Company interactions')
    cy.get(selectors.companyInteraction().archivedSummary).should(
      'contain', 'Why can I not add an interaction?')
  })
})
