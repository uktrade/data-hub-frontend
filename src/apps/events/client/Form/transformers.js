import {
  transformBoolToYesNo,
  transformIdNameToValueLabel,
  transformDateStringToDateObject,
  transformArrayIdNameToValueLabel,
  transformDateObjectToDateString,
  transformArrayOfUniqueOptions,
  transformOption,
  transformYesNoToBool,
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
  const containsLeadTeamOnly =
    teams?.length === 1 &&
    !teams?.find((item) => item.value === lead_team.value)

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
      (teams && teams.length > 1) || containsLeadTeamOnly
    ),
    teams: transformArrayIdNameToValueLabel(teams),
  }
  return result
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
  const hasRelatedTradeAgreements = transformYesNoToBool(
    has_related_trade_agreements
  )
  const hasEventShared = transformYesNoToBool(event_shared)
  const transformedValuesOnlyPayload = {
    has_related_trade_agreements: hasRelatedTradeAgreements,
    related_trade_agreements: hasRelatedTradeAgreements
      ? transformArrayOfUniqueOptions(related_trade_agreements)
      : [],
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
    teams: hasEventShared
      ? transformArrayOfUniqueOptions(
          teams ? teams.concat([lead_team]) : [lead_team]
        )
      : transformArrayOfUniqueOptions([lead_team]),
    uk_region: transformOption(uk_region),
  }
  return { ...values, ...transformedValuesOnlyPayload }
}

export { transformResponseToEventForm, transformEventFormForAPIRequest }
