// TODO: Convert back to ES6 when test understood
const { uniq } = require('lodash')

// TODO: Find the util for this and where this exists
const stringToBoolOrNull = (value) => {
  if (value && value.toLowerCase().includes('yes')) {
    return true
  } else if (value && value.toLowerCase().includes('no')) {
    return false
  }
  return null
}

// TODO: Copy to shared transformer and remove all others
const transformDateObjectToDateString = (value) => {
  if (!value) {
    throw Error('date object key is required to transform date')
  }
  const dateString = `${value.year}-${value.month}-${value.day}`
  return dateString === '--' ? null : dateString
}

// TODO: Copy to shared transformer and remove all others
const transformOption = (option) => {
  if (!option || !option.value) {
    return null
  }
  return option.value
}

// TODO: Copy to shared transformer and remove all others
const transformArrayOfOptions = (options) => {
  if (!options || !options.length) {
    return []
  }
  return uniq(options.map(transformOption))
}

const transformEventFormForAPIRequest = (values) => {
  const {
    has_related_trade_agreements,
    related_trade_agreements,
    start_date,
    end_date,
    event_type,
    location_type,
    address_country,
    lead_team,
    service,
    organiser,
    event_shared,
    related_programmes,
    teams,
    uk_region,
  } = values
  const result = {
    has_related_trade_agreements: stringToBoolOrNull(
      has_related_trade_agreements
    ),
    related_trade_agreements: transformArrayOfOptions(related_trade_agreements),
    event_type: transformOption(event_type),
    start_date: transformDateObjectToDateString(start_date),
    end_date: transformDateObjectToDateString(end_date),
    location_type: transformOption(location_type),
    address_country: transformOption(address_country),
    lead_team: transformOption(lead_team),
    service: transformOption(service),
    organiser: transformOption(organiser),
    event_shared: stringToBoolOrNull(event_shared),
    related_programmes: transformArrayOfOptions(related_programmes),
    teams: transformArrayOfOptions(teams),
    uk_region: transformOption(uk_region),
  }
  return result
}

// TODO: CHECK best way of doing this
// export { transformEventFormForAPIRequest }
module.exports = { transformEventFormForAPIRequest }
