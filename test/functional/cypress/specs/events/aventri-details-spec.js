const urls = require('../../../../../src/lib/urls')
const {
  assertBreadcrumbs,
  assertErrorDialog,
  assertKeyValueTable,
} = require('../../support/assertions')
const {
  CONTACT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')

describe('Event Aventri Details', () => {
  const existingEventId = '1111'
  const notFoundEventId = '404'
  const errorEventId = '500'

  context('when the feature flag is on', () => {
    before(() => {
      cy.setUserFeatures([CONTACT_ACTIVITY_FEATURE_FLAG])
    })

    context('when it is a valid event', () => {
      it('should display aventri event name in breadcrumb', () => {
        cy.visit(urls.events.aventri.details(existingEventId))

        assertBreadcrumbs({
          Home: urls.dashboard.route,
          Events: urls.events.index(),
          'EITA Test Event 2022': null,
        })
      })

      it('should display event details', () => {
        assertKeyValueTable('eventAventriDetails', {
          'Type of event': 'dit:aventri:Event',
          'Event date': '02 Mar 2021 to 04 May 2022',
          'Event location type': 'Not set',
          Address: 'Online',
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
  })

  context(
    'when viewing aventri details with the feature flag is disabled',
    () => {
      before(() => {
        cy.setUserFeatures([])
      })

      it('should not display aventri event name in breadcrumb', () => {
        cy.visit(urls.events.aventri.details(existingEventId))

        assertBreadcrumbs({
          Home: urls.dashboard.route,
          Events: urls.events.index(),
        })
      })
    }
  )
})
