import { assertBreadcrumbs, assertErrorDialog } from '../../support/assertions'
import { events } from '../../../../../src/lib/urls'
import { eventFaker, eventListFaker } from '../../fakers/events'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../../src/apps/companies/apps/activity-feed/constants'

const urls = require('../../../../../src/lib/urls')

describe('Event Collection List Page - React', () => {
  context('when the activity stream flag is off', () => {
    const event1 = eventFaker({
      event_type: {
        id: 'event-type-id',
        name: 'Seminar',
      },
      address_country: {
        id: 'country-id',
        name: 'Malaysia',
      },
      disabled_on: null,
      start_date: '2017-09-24',
      end_date: '2018-09-24',
      lead_team: {
        id: 'team-id',
        name: 'The A Team',
      },
      organiser: {
        id: 'organiser-id',
        first_name: 'Hannibal',
        last_name: 'Smith',
        name: 'Hannibal Smith',
      },
    })
    const event2 = eventFaker({
      uk_region: {
        id: 'region-id',
        name: 'South East',
      },
      disabled_on: '2017-09-24T16:29:35.723886',
      start_date: '2020-10-01',
    })
    const otherEvents = eventListFaker(8)
    const eventList = [event1, event2, ...otherEvents]

    before(() => {
      // Visit the new react events page - note this will need to be changed
      // to `events.index()` when ready
      // cy.setUserFeatures([])
      cy.intercept('POST', '/api-proxy/v3/search/event', {
        body: {
          count: eventList.length,
          results: eventList,
        },
      }).as('apiRequest')
      cy.visit(events.index())
      cy.wait('@apiRequest')
    })

    beforeEach(() => {
      cy.get('[data-test="collection-list"]').as('collectionList')
      cy.get('[data-test="collection-item"]').as('collectionItems')
      cy.get('@collectionItems').eq(0).as('firstListItem')
      cy.get('@collectionItems').eq(1).as('secondListItem')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Events: null,
      })
    })

    it('should have a link to add event', () => {
      cy.get('[data-test="add-collection-item-button"]')
        .should('exist')
        .should('contain', 'Add event')
        .should('have.attr', 'href', '/events/create')
    })

    it('should display a list of events', () => {
      cy.get('@collectionList').should('have.length', 1)
      cy.get('@collectionItems').should('have.length', eventList.length)
    })

    it('should contain country badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .eq(0)
        .should('contain', 'Malaysia')
    })

    it('should contain region badge', () => {
      cy.get('@secondListItem')
        .find('[data-test="badge"]')
        .eq(0)
        .should('contain', 'South East')
    })

    it('should contain disabled badge', () => {
      cy.get('@secondListItem')
        .find('[data-test="badge"]')
        .eq(1)
        .should('contain', 'Disabled')
    })

    it('should contain event type', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Type')
        .and('contain', 'Seminar')
    })

    it('should contain start date', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Begins')
        .and('contain', '24 Sep 2017')
    })

    it('should contain end date', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Ends')
        .and('contain', '24 Sep 2018')
    })

    it('should contain lead team', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Lead team')
        .and('contain', 'The A Team')
    })

    it('should contain organiser', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Organiser')
        .and('contain', 'Hannibal Smith')
    })
  })

  context('when the activity stream flag is on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
    })

    context('when there is not an error', () => {
      beforeEach(() => {
        cy.visit(events.index())
        cy.get('[data-test="data-hub-event"]').as('dataHubEvents')
        cy.get('[data-test="aventri-event"]').as('aventriEvents')
        cy.get('@dataHubEvents').eq(0).as('firstDataHubEvent')
        cy.get('@dataHubEvents').eq(1).as('secondDataHubEvent')
        cy.get('@aventriEvents').eq(0).as('firstAventriEvent')
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

      context('when sorting', () => {
        beforeEach(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc`
          ).as('recentlyUpdatedRequest')
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:asc`
          ).as('leastRecentlyUpdatedRequest')
          cy.intercept('GET', `${events.activity.data()}?sortBy=name:asc`).as(
            'nameRequest'
          )
          cy.visit(events.index())
        })

        it('sorts by recently updated by default', () => {
          cy.wait('@recentlyUpdatedRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
        })

        it('sorts by "least recently updated" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('modified_on:asc')
          cy.wait('@leastRecentlyUpdatedRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('@dataHubEvents').should('have.length', 0)
        })

        it('sorts by "name" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('name:asc')
          cy.wait('@nameRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('@aventriEvents').should('have.length', 0)
        })
      })
      context('filtering by event name', () => {
        const element = '[data-test="event-name-filter"]'
        const eventName = 'Big Event'
        const queryParamWithName = 'name=Big+Event'
        const queryParamEmpty = 'name='

        it('should not add anything to the query param whe the page is first loaded', () => {
          cy.url().should('not.include', queryParamEmpty)
        })

        it('should add name from user input to query param', () => {
          cy.get(element).type(`${eventName}{enter}`)
          cy.url().should('include', queryParamWithName)
        })

        it('should not add anything to the query param if the name is backspaced', () => {
          cy.get(element).type(`${eventName}{enter}`)
          cy.get(element).type(`{selectAll}{backspace}{enter}`)
          cy.url().should('not.include', queryParamWithName)
        })
      })
    })

    context(
      'viewing the events collection page when there is an error loading events',
      () => {
        before(() => {
          cy.intercept(
            'GET',
            `${events.activity.data()}?sortBy=modified_on:desc`,
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

    after(() => {
      cy.resetUser()
    })
  })
})
