import { contacts } from '../../../../../src/lib/urls'

describe('Contacts Collection - React', () => {
  before(() => {
    cy.visit(contacts.index())
    // Wait until page has loaded first
    cy.get('h2', { timeout: 20000 }).should('contain.text', 'contact')
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
