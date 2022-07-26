const activityFeedEventsQuery = ({ fullQuery, sort }) => ({
  query: {
    bool: {
      must: fullQuery,
    },
  },
  sort,
})

module.exports = activityFeedEventsQuery
