const { EVENT_ACTIVITY_SORT_OPTIONS } = require('../constants')
const activityFeedEventsQuery = require('../es-queries/activity-feed-all-events-query')

describe('#activityFeedEventsQuery', () => {
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

    it('should return the right query when "recently updated" filter is selected', () => {
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

    it('should return the right query when "least recently updated" filter is selected', () => {
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

    it('should return the right query when "name" ', () => {
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

    it('should return the right query when "earliest start date" filter is selected', () => {
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

    it('should return the right query when "latest start date" filter is selected', () => {
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
