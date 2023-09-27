const { faker } = require('@faker-js/faker')
var { get, has } = require('lodash')

const { EVENT_ACTIVITY_SORT_OPTIONS } = require('../constants')
const activityFeedEventsQuery = require('../es-queries/activity-feed-all-events-query')
const aventriAttendeeForCompanyQuery = require('../es-queries/aventri-attendee-for-company-query')
const externalActivityQuery = require('../es-queries/external-activity-query')
const dataHubAndActivityStreamServicesQuery = require('../es-queries/data-hub-and-activity-stream-services-query')
const aventriAttendeeQuery = require('../es-queries/aventri-attendee-query')

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
    context('should return the filtered aventri company attendee data', () => {
      const expectedEsQuery = (emails) => ({
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

    context('should return the filtered datahub and aventri data', () => {
      it('should include the aventri event id filters when provided', () => {
        const queryResult = dataHubAndActivityStreamServicesQuery({
          from: 0,
          size: 1,
          types: ['a', 'b'],
          companyIds: [1, 2, 3],
          contacts: [{ email: faker.internet.email() }],
          aventriEventIds: [4, 5, 6],
        })
        expect(
          get(
            get(
              queryResult,
              'query.bool.filter.bool.should[1].bool.must[0].term'
            ),
            ['object.type']
          )
        ).to.eq('dit:aventri:Event')
      })

      it('should exclude the aventri event id filters when they are missing', () => {
        const queryResult = dataHubAndActivityStreamServicesQuery({
          from: 0,
          size: 1,
          types: ['a', 'b'],
          companyIds: [1, 2, 3],
          contacts: [{ email: faker.internet.email() }],
        })
        expect(has(queryResult, 'query.bool.filter.bool.should[1]')).to.be.false
      })
    })

    context('should return the filtered external data', () => {
      it('should include the aventri event id filters when provided', () => {
        const queryResult = externalActivityQuery({
          from: 0,
          size: 1,
          types: ['a', 'b'],
          companyIds: [1, 2, 3],
          contacts: [{ email: faker.internet.email() }],
          aventriEventIds: [4, 5, 6],
        })
        expect(
          get(
            get(
              queryResult,
              'query.bool.filter.bool.should[2].bool.must[0].term'
            ),
            ['object.type']
          )
        ).to.eq('dit:aventri:Event')
      })

      it('should exclude the aventri event id filters when they are missing', () => {
        const queryResult = externalActivityQuery({
          from: 0,
          size: 1,
          types: ['a', 'b'],
          companyIds: [1, 2, 3],
          contacts: [{ email: faker.internet.email() }],
        })
        expect(has(queryResult, 'query.bool.filter.bool.should[2]')).to.be.false
      })
    })

    context('should return the filtered aventri attendee data', () => {
      const expectedEsQuery = ({ eventId, registrationStatuses }) => ({
        from: 3,
        size: 8,
        query: {
          bool: {
            must: [
              {
                term: {
                  'object.type': 'dit:aventri:Attendee',
                },
              },
              {
                term: {
                  'object.attributedTo.id': `dit:aventri:Event:${eventId}`,
                },
              },
              {
                terms: {
                  'object.dit:registrationStatus': registrationStatuses,
                },
              },
            ],
          },
        },
        sort: 'first_name',
      })

      const queryResult = aventriAttendeeQuery({
        from: 3,
        size: 8,
        eventId: 'ABC',
        registrationStatuses: ['D', 'G', 'Y'],
        sort: 'first_name',
      })
      expect(
        expectedEsQuery({
          eventId: 'ABC',
          registrationStatuses: ['D', 'G', 'Y'],
        })
      ).to.deep.equal(queryResult)
    })
  })
})
