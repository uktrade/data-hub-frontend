const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const { oneListTierDita } = fixtures.company

describe('Company investment - Large capital profile', () => {
  before(() => {
    cy.visit(urls.companies.investments.largeCapitalProfile(oneListTierDita.id))
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
