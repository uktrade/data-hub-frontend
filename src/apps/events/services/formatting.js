const { mapValues, isPlainObject, some, assign } = require('lodash')

function transformToApi (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    name: Object,
    event_type: Object,
    start_date: Object,
    end_date: Object,
    location_type: Object,
    address_1: Object,
    address_2: Object,
    address_town: Object,
    address_county: Object,
    postcode: Object,
    address_country: Object,
    notes: Object,
    lead_team: Object,
    organiser: Object,
    related_programmes: Array,
    teams: Array,
  }

  const formatted = mapValues(schema, (type, key) => {
    const value = body[key]

    if (!value) {
      return
    }

    return value
  })

  const setDate = (key) => {
    const dateParts = [
      body[`${key}_year`],
      body[`${key}_month`],
      body[`${key}_day`],
    ]

    if (some(dateParts)) {
      formatted[key] = dateParts.join('-')
    }
  }

  setDate('start_date')
  setDate('end_date')

  formatted.teams.push(formatted.lead_team)
  formatted.service = '1783ae93-b78f-e611-8c55-e4115bed50dc'
  return assign({}, formatted)
}

module.exports = {
  transformToApi,
}
