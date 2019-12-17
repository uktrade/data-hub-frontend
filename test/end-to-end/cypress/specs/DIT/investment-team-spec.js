const selectors = require('../../../../selectors')

const { investments } = require('../../../../../src/lib/urls')

describe('Investment team', () => {
  it('should display investment project team', () => {
    cy.visit(investments.projects.team('b30dee70-b2d6-48cf-9ce4-b9264854470c'))

    cy.get(selectors.investment.team.body)
      .should('contain', 'Client Relationship Manager')
      .and('contain', 'Puck Head')
      .and('contain', 'CBBC North EAST')
      .and('contain', 'Global Account Manager')
      .and('contain', 'Travis Greene')
      .and('contain', 'IST - Sector Advisory Services')
  })
})
