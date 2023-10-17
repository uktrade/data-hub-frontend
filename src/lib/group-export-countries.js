const { EXPORT_INTEREST_STATUS_VALUES } = require('../common/constants')

module.exports = (countries) => {
  const buckets = {}

  if (Array.isArray(countries)) {
    EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
      buckets[status] = []
    }, {})

    countries.forEach((item) => {
      const bucket = buckets[item.status]

      if (bucket) {
        bucket.push(item.country)
      }
    })

    EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
      buckets[status] = buckets[status].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    })
  }

  return buckets
}
