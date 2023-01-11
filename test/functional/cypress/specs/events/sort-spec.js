import { events } from '../../../../../src/lib/urls'

describe('Event Collections Sort', () => {
  context('When the activity stream feature flag is on', () => {
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
  })
})
