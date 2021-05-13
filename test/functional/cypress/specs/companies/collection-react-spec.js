import { assertBreadcrumbs } from '../../support/assertions'
import { companies } from '../../../../../src/lib/urls'

describe('Company Collections - React', () => {
  before(() => {
    // Visit the new react companies page - note this will need to be changed
    // to `companies.index()` when ready
    cy.visit(companies.react.index())
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: null,
    })
  })
})
