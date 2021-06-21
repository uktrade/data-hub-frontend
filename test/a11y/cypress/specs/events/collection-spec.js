import { events } from '../../../../../src/lib/urls'

describe('Events Collection - React', () => {
  before(() => {
    cy.visit(events.react.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
