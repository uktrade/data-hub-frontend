const {
  EVENT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')
const urls = require('../../../../../src/lib/urls')

describe('Aventri event attendees', () => {
  context('With the feature flag turned on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
      cy.visit(urls.events.aventriAttendees.index('1111'))
    })

    it('should display an attendee', () => {
      cy.get('[data-test="aventri-attendee"]').should('exist')
    })

    it('should display the attendee full name', () => {
      cy.get('[data-test="aventri-attendee-name"]').should(
        'contain',
        'Joe Bloggs'
      )
    })
  })
})
