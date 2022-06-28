import { events } from '../../../../../src/lib/urls'

describe('Events Collection - React', () => {
  before(() => {
    cy.visit(events.index())
    // Wait until page has loaded first
    cy.get('h1', { timeout: 20000 }).should('contain.text', 'Events')
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
