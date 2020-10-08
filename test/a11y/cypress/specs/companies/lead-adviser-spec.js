const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const { oneListTierDita } = fixtures.company

describe('Company lead adviser', () => {
  before(() => {
    cy.visit(urls.companies.advisers.index(oneListTierDita.id))
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
