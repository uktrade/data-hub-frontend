const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const urls = require('../../../../../../src/lib/urls')

const { dnbCorp } = fixtures.company

describe('Company Investment Project Collection', () => {
  before(() => {
    cy.visit(urls.companies.investments.companyInvestmentProjects(dnbCorp))
  })

  it('should load investment collection where projects have no sector', () => {
    cy.get(selectors.collection.items).first().should('not.have.text', 'Sector')
  })
})
