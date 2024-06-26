const { EVENT_ATTENDEES_MAPPING } = require('./constants')

const transformAventriEventStatusCountsToEventStatusCounts = (
  aventriStatusCounts
) =>
  Object.entries(EVENT_ATTENDEES_MAPPING).map(([key, value]) => ({
    status: key,
    urlSlug: value.urlSlug,
    count: aventriStatusCounts
      .filter((s) => value.statuses.includes(s.status))
      .reduce((sum, cur) => sum + cur.count, 0),
  }))

module.exports = {
  transformAventriEventStatusCountsToEventStatusCounts,
}
