import { interactions } from '../../../../../src/lib/urls'

describe('Interactions Collection - React', () => {
  before(() => {
    cy.visit(interactions.index())
    // Wait until page has loaded first
    cy.get('h2', { timeout: 20000 }).should('contain.text', 'interaction')
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
