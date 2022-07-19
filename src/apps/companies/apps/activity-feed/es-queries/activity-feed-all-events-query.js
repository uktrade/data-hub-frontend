const activityFeedEventsQuery = ({ sort, eventName }) => ({
  query: {
    bool: {
      must: [
        {
          terms: {
            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
          },
        },
      ],
      should: [
        {
          match: {
            'object.name': eventName || '*',
          },
        },
      ],
    },
  },
  sort,
})

module.exports = activityFeedEventsQuery
