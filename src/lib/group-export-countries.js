const { EXPORT_INTEREST_STATUS_VALUES } = require('../apps/constants')

module.exports = (countries) => {
  const buckets = {}

  if (Array.isArray(countries)) {
    EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
      buckets[ status ] = []
    }, {})

    countries.forEach((item) => {
      const bucket = buckets[item.status]

      if (bucket) {
        bucket.push(item.country)
      }
    })
  }

  return buckets
}
