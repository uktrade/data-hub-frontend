const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { investments } = require('../../../../../src/lib/urls')

describe('Investment team', () => {
  it('should display investment project team', () => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()
    cy.loadFixture([investmentProject])
    cy.visit(investments.projects.team(investmentProject.pk))

    cy.get(selectors.investment.team.body)
      .should('contain', 'Client Relationship Manager')
      .and('contain', 'Puck Head')
      .and('contain', 'CBBC North EAST')
      .and('contain', 'Global Account Manager')
      .and('contain', 'Travis Greene')
      .and('contain', 'IST - Sector Advisory Services')
  })
})
