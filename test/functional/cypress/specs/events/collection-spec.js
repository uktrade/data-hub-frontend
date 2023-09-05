import { assertErrorDialog } from '../../support/assertions'
import {
  assertRole,
  assertCollectionBreadcrumbs,
  assertAddItemButton,
  assertPaginationSummary,
} from '../../support/collection-list-assertions'
import { events } from '../../../../../src/lib/urls'

const urls = require('../../../../../src/lib/urls')

describe('Event Collection List Page - React', () => {
  context('when the activity stream flag is on', () => {
    context('when there is not an error', () => {
      beforeEach(() => {
        cy.visit(events.index())
        cy.get('[data-test="data-hub-event"]').as('dataHubEvents')
        cy.get('[data-test="aventri-event"]').as('aventriEvents')
        cy.get('@dataHubEvents').eq(0).as('firstDataHubEvent')
        cy.get('@dataHubEvents').eq(1).as('secondDataHubEvent')
        cy.get('@aventriEvents').eq(0).as('firstAventriEvent')
      })

      assertCollectionBreadcrumbs('Events')

      it('should contain a status role', () => {
        assertRole('status')
      })

      it('should display the events result count header', () => {
        cy.get('[data-test="activity-feed-collection-header"]').contains(
          '82 events'
        )
      })

      it('should have a link to add event', () => {
        assertAddItemButton('Add event', '/events/create')
      })

      it('should display the expected number of pages', () => {
        assertPaginationSummary('Page 1 of 9')
      })

      it('should not display the data hub API collection list', () => {
        cy.get('[data-test="collection-list"]').should('not.exist')
      })

      it('should display a datahub event name with link', () => {
        cy.get('@firstDataHubEvent')
          .find('[data-test="data-hub-event-name"]')
          .should('exist')
          .contains('a', 'Holiday to the Seaside')
          .should('be.visible')
          .should('have.attr', 'href', '/events/6666/details')
      })

      it('should display an aventri event name with link', () => {
        cy.get('@firstAventriEvent')
          .find('[data-test="aventri-event-name"]')
          .should('exist')
          .contains('a', 'Aventri Test Event')
          .should('be.visible')
          .should('have.attr', 'href', '/events/aventri/1113/details')
      })

      it('should display a data hub event date', () => {
        cy.get('@firstDataHubEvent')
          .find('[data-test="event-date-label"]')
          .should('exist')
          .should('contain', '30 May to 14 Jun 2022')
      })

      it('should display an Aventri event date', () => {
        cy.get('@firstAventriEvent')
          .find('[data-test="event-date-label"]')
          .should('exist')
          .should('contain', '02 Mar 2021 to 04 May 2022')
      })

      it('should display the event organiser', () => {
        cy.get('@firstDataHubEvent')
          .find('[data-test="organiser-label"]')
          .should('exist')
          .should('contain', 'Joe Bloggs')
      })

      it('should display the service type', () => {
        cy.get('@firstDataHubEvent')
          .find('[data-test="service-type-label"]')
          .should('exist')
          .should('contain', 'Best service')
      })

      it('should display the lead team', () => {
        cy.get('@firstDataHubEvent')
          .find('[data-test="lead-team-label"]')
          .should('exist')
          .should('contain', 'Digital Data Hub - Live Service')
      })

      context('when optional details are missing', () => {
        it('should display "Not set"', () => {
          cy.get('@secondDataHubEvent').find('div').find('div').as('labels')
          cy.get('@labels')
            .get('[data-test="lead-team-label"]')
            .should('contain', 'Not set')
          cy.get('@labels')
            .get('[data-test="organiser-label"]')
            .should('contain', 'Not set')
          cy.get('@labels')
            .get('[data-test="service-type-label"]')
            .should('contain', 'Not set')
        })
      })

      context('when there are more than 10 events', () => {
        it('should be possible to page through', () => {
          cy.get('[data-page-number="2"]').click()
          assertPaginationSummary('Page 2 of 9')
          cy.get('@firstDataHubEvent')
            .find('[data-test="data-hub-event-name"]')
            .should('exist')
        })
      })
    })

    context(
      'viewing the events collection page when there is an error loading events',
      () => {
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc&page=1`,
            { statusCode: 500 }
          )
          cy.visit(urls.events.index())
        })

        it('should render an error message', () => {
          assertErrorDialog(
            'TASK_GET_ALL_ACTIVITY_FEED_EVENTS',
            'Unable to load events.'
          )
        })
      }
    )
  })
})
