const urls = require('../../../../../src/lib/urls')
const { assertBreadcrumbs } = require('../../support/assertions')

describe('Event Aventri Details', () => {
  it('should display event name in breadcrumb', () => {
    cy.visit(urls.events.aventri.details('1111'))

    assertBreadcrumbs({
      Home: urls.dashboard.route,
      Events: urls.events.index(),
      'EITA Test Event 2022': null,
    })
  })
})
