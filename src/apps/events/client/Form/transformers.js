import {
  transformDateObjectToDateString,
  transformArrayOfUniqueOptions,
  transformOption,
  transformYesNoToBool,
} from '../../../../client/transformers'

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
    has_related_trade_agreements: transformYesNoToBool(
      has_related_trade_agreements
    ),
    related_trade_agreements: transformArrayOfUniqueOptions(
      related_trade_agreements
    ),
    event_type: transformOption(event_type),
    start_date: transformDateObjectToDateString(start_date),
    end_date: transformDateObjectToDateString(end_date),
    location_type: transformOption(location_type),
    address_country: transformOption(address_country),
    lead_team: transformOption(lead_team),
    service: transformOption(service),
    organiser: transformOption(organiser),
    event_shared: transformYesNoToBool(event_shared),
    related_programmes: transformArrayOfUniqueOptions(related_programmes),
    teams: transformArrayOfUniqueOptions(
      teams ? teams.concat([lead_team]) : [lead_team]
    ),
    uk_region: transformOption(uk_region),
  }
  return result
}

export { transformEventFormForAPIRequest }
