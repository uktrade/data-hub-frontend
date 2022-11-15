const { EVENT_ACTIVITY_SORT_OPTIONS } = require('../constants')
const activityFeedEventsQuery = require('../es-queries/activity-feed-all-events-query')
const aventriAttendeeForCompanyQuery = require('../es-queries/aventri-attendee-for-company-query')
const { faker } = require('@faker-js/faker')

describe('#activityFeedEventsQuery', () => {
  context('query applies correct sort', () => {
    const allDataHubAndAventriEventsQuery = [
      {
        terms: {
          'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
        },
      },
    ]

    context('sorts by recently updated', () => {
      const expectedEsQuery = (order) => ({
        from: 0,
        size: 10,
        query: {
          bool: {
            must: [
              {
                terms: {
                  'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
                },
              },
            ],
          },
        },
        sort: {
          'object.updated': {
            order: order,
            unmapped_type: 'date',
          },
        },
      })

      it('should return the right query when default sort is used', () => {
        const sortBy = undefined
        expect(expectedEsQuery('desc')).to.deep.equal(
          activityFeedEventsQuery({
            fullQuery: allDataHubAndAventriEventsQuery,
            sort:
              EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
              EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
          })
        )
      })

      it('should return the right query when "Recently updated" sort by is selected', () => {
        const sortBy = 'modified_on:asc'
        expect(expectedEsQuery('asc')).to.deep.equal(
          activityFeedEventsQuery({
            fullQuery: allDataHubAndAventriEventsQuery,
            sort:
              EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
              EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
          })
        )
      })

      it('should return the right query when "Least recently updated" sort by is selected', () => {
        const sortBy = 'modified_on:desc'
        expect(expectedEsQuery('desc')).to.deep.equal(
          activityFeedEventsQuery({
            fullQuery: allDataHubAndAventriEventsQuery,
            sort:
              EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
              EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
          })
        )
      })
    })

    context('sorts by name', () => {
      const expectedEsQuery = (order) => ({
        from: 0,
        size: 10,
        query: {
          bool: {
            must: [
              {
                terms: {
                  'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
                },
              },
            ],
          },
        },
        sort: {
          'object.name.raw': {
            order: order,
            unmapped_type: 'string',
          },
        },
      })

      it('should return the right query when "Event name A-Z" sort by is selected ', () => {
        const sortBy = 'name:asc'
        expect(expectedEsQuery('asc')).to.deep.equal(
          activityFeedEventsQuery({
            fullQuery: allDataHubAndAventriEventsQuery,
            sort:
              EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
              EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
          })
        )
      })
    })

    context('sorts by start date', () => {
      const expectedEsQuery = (order) => ({
        from: 0,
        size: 10,
        query: {
          bool: {
            must: [
              {
                terms: {
                  'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
                },
              },
            ],
          },
        },
        sort: {
          'object.startTime': {
            order: order,
            unmapped_type: 'date',
          },
        },
      })

      it('should return the right query when "Earliest start date" sort by is selected', () => {
        const sortBy = 'start_date:asc'
        expect(expectedEsQuery('asc')).to.deep.equal(
          activityFeedEventsQuery({
            fullQuery: allDataHubAndAventriEventsQuery,
            sort:
              EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
              EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
          })
        )
      })

      it('should return the right query when "Latest start date" sort by is selected', () => {
        const sortBy = 'start_date:desc'
        expect(expectedEsQuery('desc')).to.deep.equal(
          activityFeedEventsQuery({
            fullQuery: allDataHubAndAventriEventsQuery,
            sort:
              EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
              EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
          })
        )
      })
    })
  })

  context('query applies correct filtering', () => {
    context('filters aventri attendee data', () => {
      const expectedEsQuery = (emails) => ({
        size: 20,
        query: {
          bool: {
            must: [
              {
                term: {
                  'object.type': 'dit:aventri:Attendee',
                },
              },
              {
                terms: {
                  'object.dit:emailAddress': emails,
                },
              },
            ],
          },
        },
        sort: {
          'object.updated': {
            order: 'desc',
            unmapped_type: 'date',
          },
        },
      })

      const contactEmails = [faker.internet.email(), faker.internet.email()]
      expect(expectedEsQuery(contactEmails)).to.deep.equal(
        aventriAttendeeForCompanyQuery(
          contactEmails.map((contact) => {
            return { email: contact }
          })
        )
      )
    })
  })
})
