const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Event Attendees', () => {
  before(() => {
    cy.visit(`/events/${fixtures.event.teddyBearExpo.id}/attendees`)
  })

  it('should not display add attendees button for disabled events', () => {
    cy.get(selectors.message.info).should(
      'contain',
      'This event was disabled on 5 September 2017 and can no longer be edited.'
    )
    cy.get(selectors.entityCollection.addAttendee).should('not.exist')
  })

  it('should display attendee collection', () => {
    cy.get(selectors.collection.headerCount).should('contain', '1,233')
  })
})
