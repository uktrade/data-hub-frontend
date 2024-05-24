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
  })
})
