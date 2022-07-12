const activityFeedEventsQuery = ({ order }) => ({
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
      order,
      unmapped_type: 'date',
    },
  },
})

module.exports = activityFeedEventsQuery
