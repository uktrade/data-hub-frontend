import { omis } from '../../../../../src/lib/urls'

describe('Orders (OMIS) Collection - React', () => {
  before(() => {
    cy.visit(omis.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
