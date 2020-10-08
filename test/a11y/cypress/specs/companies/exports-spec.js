const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Company exports', () => {
  before(() => {
    cy.visit(urls.companies.exports.index(fixtures.company.oneListTierDita.id))
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
