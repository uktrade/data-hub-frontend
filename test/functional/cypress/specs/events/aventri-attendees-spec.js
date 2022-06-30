const {
  EVENT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')
const urls = require('../../../../../src/lib/urls')
const { assertErrorDialog } = require('../../support/assertions')

describe('Aventri event attendees', () => {
  const errorId = '500'
  context('With the feature flag turned on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
    })
    context('With normal behaviour', () => {
      before(() => {
        cy.visit(urls.events.aventriAttendees.index('1111'))
      })

      it('should display an attendee', () => {
        cy.get('[data-test="aventri-attendee"]').should('exist')
      })

      it('should display the attendee full name', () => {
        cy.get('[data-test="aventri-attendee-name"]').should(
          'contain',
          'Elle Woods'
        )
      })
    })

    context('With errors', () => {
      before(() => {
        cy.visit(urls.events.aventriAttendees.index(errorId))
      })

      it('should render an error message', () => {
        assertErrorDialog(
          'TASK_GET_EVENT_AVENTRI_ATTENDEES',
          'Unable to load Aventri Attendees.'
        )
      })
    })

    after(() => {
      cy.resetUser()
    })
  })

  context('With the feature flag turned off', () => {
    before(() => {
      cy.visit(urls.events.aventriAttendees.index('1111'))
    })
    it('should not display an aventri attendee', () => {
      cy.get('[data-test="aventri-attendee"]').should('not.exist')
    })
  })
})
