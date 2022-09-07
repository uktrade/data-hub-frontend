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

  const aventriLink =
    'https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid='
  const aventriLinkText = 'View in Aventri'
  const newTabText = 'opens in a new window or tab'

  context('when the feature flag is on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
      cy.visit(urls.events.aventri.details(existingEventId))
    })

    context('when it is a valid event', () => {
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
      })

      it('should display the event name in the header', () => {
        cy.get('[data-test="heading"]').should(
          'contain',
          'EITA Test Event 2022'
        )
      })

      it('should display event details', () => {
        assertKeyValueTable('eventAventriDetails', {
          'Event date': '02 Mar 2021 to 04 May 2022',
          'Event location type': 'Name of Location',
          Address: '1 street avenueBrockleyLondonABC 123England',
        })
        cy.get('[data-test="eventAventriDetails"]').within(() => {
          cy.get('[data-test="newWindowLink"]')
            .should('have.attr', 'aria-label', 'Opens in a new window or tab')
            .should('have.attr', 'href', aventriLink + existingEventId)
            .should('have.text', aventriLinkText)
        })
      })

      it('should render the aventri status message and link', () => {
        const aventriStatusHeader =
          'This event has been automatically synced from Aventri.'
        const aventriStatusContent =
          'Event details, registrants and attendees can only be edited in Aventri. Changes can take up to 24 hours to sync.'

        cy.get('[data-test="status-message"]').within(() => {
          cy.get('[class="statusHeader"]').should(
            'contain.text',
            aventriStatusHeader
          )
          cy.get('[class="statusContent"]').should(
            'contain.text',
            aventriStatusContent
          )
          cy.get('[data-test="newWindowLink"]')
            .should('have.attr', 'aria-label', 'Opens in a new window or tab')
            .should('have.attr', 'href', aventriLink + existingEventId)
            .should('have.text', aventriLinkText)
          cy.contains(newTabText).should('be.visible')
        })
      })

      context('when optional details are missing', () => {
        it('should display "Not set"', () => {
          const eventId = '6666'
          cy.visit(urls.events.aventri.details(eventId))
          assertKeyValueTable('eventAventriDetails', {
            'Event date': '02 Mar 2021',
            'Event location type': 'Not set',
            Address: 'Not set',
          })
          cy.get('[data-test="eventAventriDetails"]').within(() => {
            cy.get('[data-test="newWindowLink"]')
              .should('have.attr', 'aria-label', 'Opens in a new window or tab')
              .should('have.attr', 'href', aventriLink + eventId)
              .should('have.text', aventriLinkText)
          })
        })
      })
    })

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
    after(() => {
      cy.resetUser()
    })
  })

  context(
    'when viewing aventri details with the feature flag is disabled',
    () => {
      before(() => {
        cy.visit(urls.events.aventri.details(existingEventId))
      })

      it('should not display aventri event name in breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.route,
          Events: urls.events.index(),
        })
      })
    }
  )
})
