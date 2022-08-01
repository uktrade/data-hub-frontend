const activityFeedEventsQuery = ({ fullQuery, from, size, sort }) => ({
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
