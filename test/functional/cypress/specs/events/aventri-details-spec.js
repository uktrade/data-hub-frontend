const urls = require('../../../../../src/lib/urls')
const {
  assertBreadcrumbs,
  assertErrorDialog,
  assertKeyValueTable,
} = require('../../support/assertions')

//TODO - Reinstate this test once we have restored the Aventri integration
describe.skip('Event Aventri Details', () => {
  const eventInPastId = '1111'
  const notFoundEventId = '404'
  const errorEventId = '500'

  const aventriLink =
    'https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid='
  const aventriLinkText = 'View in Aventri (opens in new tab)'

  context('when it is a valid event ', () => {
    beforeEach(() => {
      cy.visit(urls.events.aventri.details(eventInPastId))
    })
    it('should display aventri event name in breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index.route,
        Events: urls.events.index(),
        'EITA Test Event 2022': null,
      })
    })

    context('should display the side nav bar', () => {
      it('with the details link', () => {
        cy.get('[data-test="event-aventri-nav"]').should('exist')
        cy.get('[data-test="event-aventri-details-link"]')
          .should('contain', 'Details')
          .should(
            'have.attr',
            'href',
            urls.events.aventri.details(eventInPastId)
          )
      })
      var registrationStatusTests = [
        {
          status: 'registered',
          expected: {
            total: 28,
            label: 'Registered',
          },
        },
        {
          status: 'did-not-attend',
          expected: {
            total: 2,
            label: 'Did not attend',
          },
        },
        {
          status: 'waiting-list',
          expected: {
            total: 11,
            label: 'Waiting list',
          },
        },
        {
          status: 'attended',
          expected: {
            total: 24,
            label: 'Attended',
          },
        },
        {
          status: 'cancelled',
          expected: {
            total: 7,
            label: 'Cancelled',
          },
        },
      ]
      registrationStatusTests.forEach(function (test) {
        it(`with the link for the ${test.status} status`, () => {
          cy.get(`[data-test="event-aventri-status-link-${test.status}"]`)
            .should(
              'contain',
              `${test.expected.label} (${test.expected.total})`
            )
            .should(
              'have.attr',
              'href',
              urls.events.aventri.registrationStatus(eventInPastId, test.status)
            )
        })
      })
    })

    it('should display the event name in the header', () => {
      cy.get('[data-test="heading"]').should('contain', 'EITA Test Event 2022')
    })

    it('should display event details', () => {
      assertKeyValueTable('eventAventriDetails', {
        'Event date': '02 Mar 2021 to 04 May 2022',
        'Event location type': 'Name of Location',
        Address: '1 street avenueBrockleyLondonABC 123England',
      })
      cy.get('[data-test="eventAventriDetails"]').within(() => {
        cy.get('[data-test="newWindowLink"]')
          .should('have.attr', 'href', aventriLink + eventInPastId)
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
          .should('have.attr', 'href', aventriLink + eventInPastId)
          .should('have.text', aventriLinkText)
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
        Home: urls.dashboard.index.route,
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
        Home: urls.dashboard.index.route,
        Events: urls.events.index(),
      })
      assertErrorDialog(
        'TASK_GET_EVENT_AVENTRI_DETAILS',
        'Unable to load aventri event details.'
      )
    })
  })
})
