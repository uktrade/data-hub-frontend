const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Event Attendees', () => {
  it('Enabled events', () => {
    cy.visit(`/events/${fixtures.event.oneDayExhibition.id}/attendees`)
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Events: urls.events.index(),
      'One-day exhibition': null,
      Attendees: null,
    })
    assertLocalHeader('One-day exhibition')
    cy.contains('h2', 'Event Attendees')
    cy.contains('h2', '1,233 attendees')
    cy.contains('Page 1 of 124')
  })

  it('Disabled events', () => {
    cy.visit(`/events/${fixtures.event.teddyBearExpo.id}/attendees`)
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Events: urls.events.index(),
      'Teddy bear expo': null,
      Attendees: null,
    })
    assertLocalHeader('Teddy bear expo')
    assertLocalHeader(
      'This event was disabled on 5 September 2017 and can no longer be edited'
    )
    cy.contains(
      'You cannot add an event attendee because the event has been disabled.'
    )
    cy.contains('Add attendee').should('not.exist')
  })
})
