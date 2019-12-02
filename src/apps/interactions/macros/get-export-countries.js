const castCompactArray = require('../../../lib/cast-compact-array')

const { EXPORT_INTEREST_STATUS_VALUES } = require('../constants')

module.exports = (body) => {
  const data = []

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    const countryIds = castCompactArray(body[status])

    if (countryIds.length) {
      countryIds.forEach((id) => data.push({ country: { id }, status }))
    }
  })

  return data
}
