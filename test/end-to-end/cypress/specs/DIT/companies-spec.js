const selectors = require('../../../../selectors')

describe('Advisors', () => {
  const globalManagerTable = 2
  const AdviserTable = 3

  it('should display advisers for a GHQ for a given company', () => {
    cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/advisers')

    cy.get(selectors.collection.contentHeader)
      .should('contain', 'Advisers on the core team')

    cy.get(selectors.collection.contentTable(globalManagerTable))
      .should('contain', 'IST - Sector Advisory Services')
      .and('contain', 'London')
      .and('contain', 'Travis Greene')

    cy.get(selectors.collection.contentTable(AdviserTable))
      .should('contain', 'Heart of the South West LEP')
      .and('contain', 'South West')
      .and('contain', 'Holly Collins')
      .and('contain', 'IG - Specialists - Knowledge Intensive Industry')
      .and('contain', 'London')
      .and('contain', 'Jenny Carey')
  })
})
