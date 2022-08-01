const activityFeedEventsQuery = ({ fullQuery, from = 0, size = 10, sort }) => ({
  from,
  size,
  query: {
    bool: {
      must: fullQuery,
    },
  },
  sort,
})

module.exports = activityFeedEventsQuery
