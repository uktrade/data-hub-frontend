// TODO: Find the util for this and where this exists
const stringToBoolOrNull = (value) => {
  if (value && value.toLowerCase().includes('yes')) {
    return true
  } else if (value && value.toLowerCase().includes('no')) {
    return false
  }
  return null
}

const transformDateObjectToDateString = (value) => {
  if (!value) {
    throw Error('date object key is required to transform date')
  }
  const dateString = `${value.year}-${value.month}-${value.day}`
  return dateString === '--' ? null : dateString
}

const transformFromEventform = (values) => {
  const {
    has_related_trade_agreements,
    related_trade_agreements,
    name,
    start_date,
    end_date,
    event_type,
    location_type,
    address_1,
    address_2,
    address_town,
    address_county,
    address_postcode,
    address_country,
    notes,
    lead_team,
    service,
    organiser,
    event_shared,
    related_programmes,
  } = values
  const result = {
    has_related_trade_agreements: stringToBoolOrNull(
      has_related_trade_agreements
    ),
    related_trade_agreements: related_trade_agreements?.map(
      (item) => item.value
    ),
    name,
    event_type: event_type?.value,
    start_date: transformDateObjectToDateString(start_date),
    end_date: transformDateObjectToDateString(end_date),
    location_type: location_type?.value,
    address_1,
    address_2,
    address_town,
    address_county,
    address_postcode,
    address_country: address_country?.value,
    notes,
    lead_team: lead_team?.value,
    service: service?.value,
    organiser: organiser?.value,
    event_shared: stringToBoolOrNull(event_shared),
    related_programmes: related_programmes?.map((item) => item.value),
  }
  return result
}

export { transformFromEventform }
