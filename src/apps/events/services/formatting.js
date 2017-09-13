const { mapValues, isPlainObject } = require('lodash')

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
    formatted[key] = [
      body[`${key}_year`],
      body[`${key}_month`],
      body[`${key}_day`],
    ].join('-')
  }

  setDate('start_date')
  setDate('end_date')

  return Object.assign({}, formatted)
}

module.exports = {
  transformToApi,
}
