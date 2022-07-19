const {
  EVENT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')
const urls = require('../../../../../src/lib/urls')
const {
  assertErrorDialog,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Aventri event attendees', () => {
  const existingEventId = '1111'
  const errorId = '500'
  context('With the feature flag turned on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
    })
    context('With normal behaviour', () => {
      before(() => {
        cy.visit(urls.events.aventri.attendees(existingEventId))
      })

      it('should display aventri event name in breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.route,
          Events: urls.events.index(),
          'EITA Test Event 2022': null,
        })
      })

      it('should display the side nav bar', () => {
        cy.get('[data-test="event-aventri-nav"]').should('exist')
        cy.get('[data-test="event-aventri-details-link"]')
          .should('contain', 'Details')
          .should(
            'have.attr',
            'href',
            urls.events.aventri.details(existingEventId)
          )
        cy.get('[data-test="event-aventri-attendees-link"]')
          .should('contain', 'Attendees')
          .should(
            'have.attr',
            'href',
            urls.events.aventri.attendees(existingEventId)
          )
      })

      it('should display an attendee', () => {
        cy.get('[data-test="aventri-attendee"]').should('exist')
      })
    })

    context('With errors', () => {
      before(() => {
        cy.visit(urls.events.aventri.attendees(errorId))
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

  // context('With the feature flag turned off', () => {
  //   before(() => {
  //     cy.visit(urls.events.aventri.attendees(existingEventId))
  //   })
  //   it('should not display an aventri attendee', () => {
  //     cy.get('[data-test="aventri-attendee"]').should('not.exist')
  //   })
  // })
})
