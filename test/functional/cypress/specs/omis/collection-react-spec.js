import { assertBreadcrumbs } from '../../support/assertions'
import { omis } from '../../../../../src/lib/urls'

describe('Orders (OMIS) Collection List Page - React', () => {
  before(() => {
    // Visit the new react events page - note this will need to be changed
    // to `omis.index()` when ready
    cy.visit(omis.react.index())
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      'Orders (OMIS)': null,
    })
  })
})
