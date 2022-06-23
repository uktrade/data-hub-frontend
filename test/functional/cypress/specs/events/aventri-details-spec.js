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
  context('when viewing a aventri details with the feature flag is on', () => {
    before(() => {
      cy.setUserFeatures([CONTACT_ACTIVITY_FEATURE_FLAG])
    })

    it('should display aventri event name in breadcrumb', () => {
      cy.visit(urls.events.aventri.details('1111'))

      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Events: urls.events.index(),
        'EITA Test Event 2022': null,
      })

      assertKeyValueTable('eventAventriDetails', {
        'Type of event': 'dit:aventri:Event',
        'Event date': '02 Mar 2021 to 04 May 2022',
        'Event location type': 'Not set',
        Address: 'Online',
      })
    })
  })

  context(
    'when viewing aventri details with the feature flag is disabled',
    () => {
      it('should not display aventri event name in breadcrumb', () => {
        cy.visit(urls.events.aventri.details('2222'))

        assertBreadcrumbs({
          Home: urls.dashboard.route,
          Events: urls.events.index(),
        })
      })
    }
  )

  context('when viewing aventri details with error loading', () => {
    before(() => {
      cy.setUserFeatures([CONTACT_ACTIVITY_FEATURE_FLAG])
      cy.intercept(
        'GET',
        `${urls.events.aventri.details(
          ''
        )}?featureTesting=user-contact-activities`,
        {
          statusCode: 500,
        }
      )
    })

    it('should render an error message', () => {
      cy.visit(urls.events.aventri.details('no-id'))
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
