const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Stova Event Attendees', () => {
  it('Enabled events', () => {
    cy.visit(urls.events.stova.attendees(fixtures.event.stovaEvent.id))
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Events: urls.events.index(),
      'Event from stova': null,
      Attendees: null,
    })
    assertLocalHeader('Stova Event Attendees')
    cy.contains('h2', 'Stova Event Attendees')
    cy.contains('h2', '1,233 attendees')
    cy.contains('Page 1 of 124')
  })
})
