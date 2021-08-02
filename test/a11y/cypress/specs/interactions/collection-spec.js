import { interactions } from '../../../../../src/lib/urls'

describe('Interactions Collection - React', () => {
  before(() => {
    cy.visit(interactions.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
