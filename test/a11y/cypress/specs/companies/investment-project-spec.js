const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const { oneListTierDita } = fixtures.company

describe('Company investment - projects', () => {
  before(() => {
    cy.visit(urls.companies.investments.companyInvestment(oneListTierDita.id))
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
