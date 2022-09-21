import { events } from '../../../../../src/lib/urls'
import { ACTIVITY_STREAM_FEATURE_FLAG } from '../../../../../src/apps/companies/apps/activity-feed/constants'

const searchEndpoint = '/api-proxy/v3/search/event'

describe('Event Collections Sort', () => {
  context('When the activity stream feature flag is off', () => {
    context('Default sort', () => {
      before(() => {
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(events.index())
      })

      it('should apply the default sort', () => {
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.sortby).to.equal('modified_on:desc')
        })
      })

      it('should have all sort options', () => {
        cy.get('[data-test="sortby"] option').then((options) => {
          const sortOptions = [...options].map((o) => [o.value, o.text])
          expect(sortOptions).to.deep.eq([
            ['name:asc', 'Event name A-Z'],
            ['modified_on:desc', 'Recently updated'],
            ['modified_on:asc', 'Least recently updated'],
            ['start_date:asc', 'Earliest start date'],
            ['start_date:desc', 'Latest start date'],
          ])
        })
      })
    })

    context('User sort', () => {
      const element = '[data-test="sortby"] select'

      beforeEach(() => {
        cy.intercept('POST', searchEndpoint).as('apiRequest')
        cy.visit(`${events.index()}?page=1`)
        cy.wait('@apiRequest')
      })

      it('should sort by "Event name A-Z" when changed back to default', () => {
        cy.get(element).select('modified_on:desc')
        cy.wait('@apiRequest')
        cy.get(element).select('name:asc')
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.sortby).to.equal('name:asc')
        })
      })

      it('should sort by "Recently updated"', () => {
        cy.get(element).select('modified_on:desc')
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.sortby).to.equal('modified_on:desc')
        })
      })

      it('should sort by "Least recently updated"', () => {
        cy.get(element).select('modified_on:asc')
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.sortby).to.equal('modified_on:asc')
        })
      })

      it('should sort by "Earliest start date"', () => {
        cy.get(element).select('start_date:asc')
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.sortby).to.equal('start_date:asc')
        })
      })

      it('should sort by "Latest start date"', () => {
        cy.get(element).select('start_date:desc')
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.sortby).to.equal('start_date:desc')
        })
      })
    })
  })

  context('When the activity stream feature flag is on', () => {
    before(() => {
      cy.setUserFeatures([ACTIVITY_STREAM_FEATURE_FLAG])
    })

    beforeEach(() => {
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:desc&page=1`
      ).as('recentlyUpdatedRequest')
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=modified_on:asc&page=1`
      ).as('leastRecentlyUpdatedRequest')
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=name:asc&page=1`
      ).as('nameRequest')
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=start_date:asc&page=1`
      ).as('earliestStartDateRequest')
      cy.intercept(
        'GET',
        `${events.activity.data()}?sortBy=start_date:desc&page=1`
      ).as('latestStartDateRequest')
      cy.visit(events.index())
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => [o.value, o.text])
        expect(sortOptions).to.deep.eq([
          ['modified_on:desc', 'Recently updated'],
          ['modified_on:asc', 'Least recently updated'],
          ['name:asc', 'Event name A-Z'],
          ['start_date:asc', 'Earliest start date'],
          ['start_date:desc', 'Latest start date'],
        ])
      })
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
    })

    it('sorts by "name" when selected', () => {
      const element = '[data-test="sortby"] select'
      cy.get(element).select('name:asc')
      cy.wait('@nameRequest').then((request) => {
        expect(request.response.statusCode).to.eql(200)
      })
    })

    it('sorts by "earliest start date" when selected', () => {
      const element = '[data-test="sortby"] select'
      cy.get(element).select('start_date:asc')
      cy.wait('@earliestStartDateRequest').then((request) => {
        expect(request.response.statusCode).to.eql(200)
      })
    })

    it('sorts by "latest start date" when selected', () => {
      const element = '[data-test="sortby"] select'
      cy.get(element).select('start_date:desc')
      cy.wait('@latestStartDateRequest').then((request) => {
        expect(request.response.statusCode).to.eql(200)
      })
    })

    after(() => {
      cy.resetUser()
    })
  })
})
