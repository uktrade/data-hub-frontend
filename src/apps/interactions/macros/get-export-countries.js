const { EXPORT_INTEREST_STATUS_VALUES } = require('../constants')

module.exports = (body) => {
  const data = []

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    const countryIds = body[status]

    if (Array.isArray(countryIds) && countryIds.length) {
      countryIds.forEach((id) => data.push({ country: { id }, status }))
    }
  })

  return data
}
