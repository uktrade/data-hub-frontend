import urls from '../../../../../src/lib/urls'

const { assertBreadcrumbs } = require('../../support/assertions')

const fixtures = require('../../fixtures')

describe('Stova Event Details', () => {
  it('should display event details with correct stova details', () => {
    cy.visit(urls.events.stova.details(fixtures.event.stovaEvent.id))
    assertBreadcrumbs({
      Home: urls.dashboard.index.route,
      Events: urls.events.index(),
      'Event from stova': null,
      Details: null,
    })
  })
})
