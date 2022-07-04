const urls = require('../../../../../src/lib/urls')
const {
  assertBreadcrumbs,
  assertErrorDialog,
  assertKeyValueTable,
} = require('../../support/assertions')
const {
  EVENT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')

describe('Event Aventri Details', () => {
  const existingEventId = '1111'
  const notFoundEventId = '404'
  const errorEventId = '500'

  context('when the feature flag is on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
    })

    context('when it is a valid event', () => {
      before(() => {
        cy.visit(urls.events.aventri.details(existingEventId))
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

      it('should display the event name in the header', () => {
        cy.get('[data-test="heading"]').should(
          'contain',
          'EITA Test Event 2022'
        )

        it('should display event details', () => {
          assertKeyValueTable('eventAventriDetails', {
            'Type of event': 'dit:aventri:Event',
            'Event date': '02 Mar 2021 to 04 May 2022',
            'Event location type': 'Name of Location',
            Address: '1 street avenueBrockleyLondonABC 123England',
          })
        })

        context('when optional details are missing', () => {
          it('should display "Not set"', () => {
            cy.visit(urls.events.aventri.details('6666'))
            assertKeyValueTable('eventAventriDetails', {
              'Type of event': 'dit:aventri:Event',
              'Event date': '02 Mar 2021',
              'Event location type': 'Not set',
              Address: 'Not set',
            })
          })
        })
      })
    })

    context('with errors', () => {
      context('when the event is not found', () => {
        before(() => {
          cy.visit(urls.events.aventri.details(notFoundEventId))
        })

        it('should render an error message', () => {
          assertBreadcrumbs({
            Home: urls.dashboard.route,
            Events: urls.events.index(),
          })
          assertErrorDialog(
            'TASK_GET_EVENT_AVENTRI_DETAILS',
            'Unable to load aventri event details.'
          )
        })
      })
      context('when there is a network error', () => {
        before(() => {
          cy.visit(urls.events.aventri.details(errorEventId))
        })

        it('should render an error message', () => {
          assertBreadcrumbs({
            Home: urls.dashboard.route,
            Events: urls.events.index(),
          })
          assertErrorDialog(
            'TASK_GET_EVENT_AVENTRI_DETAILS',
            'Unable to load aventri event details.'
          )
        })
      })
    })
    after(() => {
      cy.resetUser()
    })
  })

  context('when the feature flag is disabled', () => {
    before(() => {
      cy.visit(urls.events.aventri.details(existingEventId))
    })

    it('should not display aventri event name in breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Events: urls.events.index(),
      })
    })
  })
})
