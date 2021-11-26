import {
  transformBoolToYesNo,
  transformIdNameToValueLabel,
  transformDateStringToDateObject,
  transformArrayIdNameToValueLabel,
} from '../../../../client/transformers'

const transformResponseToEventForm = (data) => {
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
    related_programmes,
    teams,
    uk_region,
  } = data
  const result = {
    has_related_trade_agreements: transformBoolToYesNo(
      has_related_trade_agreements
    ),
    event_type: transformIdNameToValueLabel(event_type),
    start_date: transformDateStringToDateObject(start_date),
    end_date: transformDateStringToDateObject(end_date),
    location_type: transformIdNameToValueLabel(location_type),
    address_country: transformIdNameToValueLabel(address_country),
    uk_region: transformIdNameToValueLabel(uk_region),
    lead_team: transformIdNameToValueLabel(lead_team),
    service: transformIdNameToValueLabel(service),
    organiser: transformIdNameToValueLabel(organiser),
    related_trade_agreements: transformArrayIdNameToValueLabel(
      related_trade_agreements
    ),
    related_programmes: transformArrayIdNameToValueLabel(related_programmes),
    event_shared: transformBoolToYesNo(
      teams?.length > 1 ||
        (teams?.length === 1 &&
          !teams?.find((item) => item.value === lead_team?.value))
    ),
    teams: transformArrayIdNameToValueLabel(teams),
  }
  return result
}

export { transformResponseToEventForm }
