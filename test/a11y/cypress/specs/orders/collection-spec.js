import { omis } from '../../../../../src/lib/urls'

describe('Orders (OMIS) Collection - React', () => {
  before(() => {
    cy.visit(omis.index())
    // Wait until page has loaded first
    cy.get('h2', { timeout: 20000 }).should('contain.text', 'order')
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
