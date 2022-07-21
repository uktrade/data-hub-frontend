const activityFeedEventsQuery = ({ filtersQuery, sort }) => ({
  query: {
    bool: {
      must: filtersQuery,
    },
  },
  sort,
})

module.exports = activityFeedEventsQuery
