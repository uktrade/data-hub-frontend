import { assertBreadcrumbs } from '../../support/assertions'
import { contacts } from '../../../../../src/lib/urls'

describe('Contacts Collections - React', () => {
  before(() => {
    // Visit the new react companies page - note this will need to be changed
    // to `contacts.index()` when ready
    cy.visit(contacts.react.index())
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Contacts: null,
    })
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Contacts')
  })
})
