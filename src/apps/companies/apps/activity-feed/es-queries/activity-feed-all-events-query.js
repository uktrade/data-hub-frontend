const activityFeedEventsQuery = ({ fullQuery, page, size, sort }) => ({
  page,
  size,
  query: {
    bool: {
      must: fullQuery,
    },
  },
  sort,
})

module.exports = activityFeedEventsQuery
