import { assertBreadcrumbs } from '../../support/assertions'
import { events } from '../../../../../src/lib/urls'

describe('Event Collection List Page - React', () => {
  before(() => {
    // Visit the new react events page - note this will need to be changed
    // to `events.index()` when ready
    cy.visit(events.react.index())
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Events: null,
    })
  })
})
