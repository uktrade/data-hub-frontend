const activityFeedEventsQuery = ({ sort }) => ({
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
  sort,
})

module.exports = activityFeedEventsQuery
