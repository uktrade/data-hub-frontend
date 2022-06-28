const activityFeedEventsQuery = () => {
  return {
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
        order: 'asc',
        unmapped_type: 'string',
      },
    },
  }
}

module.exports = activityFeedEventsQuery
