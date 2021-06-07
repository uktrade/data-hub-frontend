import { assertBreadcrumbs } from '../../support/assertions'
import { interactions } from '../../../../../src/lib/urls'

describe('Interactions Collections - React', () => {
  before(() => {
    // Visit the new react interactions page - note this will need to be changed
    // to `interactions.index()` when ready
    cy.visit(interactions.react())
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Interactions: null,
    })
  })
})
