import { companies } from '../../../../../src/lib/urls'

describe('Company Collection - React', () => {
  before(() => {
    cy.visit(companies.react.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
