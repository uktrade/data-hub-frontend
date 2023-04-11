import {
  transformOption,
  transformDateObjectToDateString,
} from '../../../../transformers'

const checkCurrencyField = (currencyField) =>
  currencyField || currencyField <= 0 ? currencyField : null

const getName = (obj) => obj.name

export const transformArray = (arr = []) => arr.map(getName).join(', ')

export const transformValueToId = (values = []) =>
  values.map((value) => ({ id: value.value }))

export const transformInvestorDetailsToApi = ({
  profileId,
  companyId,
  values,
}) => {
  const {
    investor_type: investorType,
    global_assets_under_management,
    investable_capital,
    investor_notes,
    required_checks,
    date,
    adviser,
  } = values

  return {
    id: profileId,
    investor_company_id: companyId,
    investor_type: transformOption(investorType),
    global_assets_under_management: checkCurrencyField(
      global_assets_under_management
    ),
    investable_capital: checkCurrencyField(investable_capital),
    investor_description: investor_notes,
    required_checks_conducted: required_checks,
    required_checks_conducted_on: transformDateObjectToDateString(date),
    required_checks_conducted_by: adviser
      ? transformOption(adviser)
      : undefined,
  }
}

export const transformLocationDetailsToApi = ({
  profileId,
  companyId,
  values,
}) => {
  const {
    uk_region_locations,
    other_countries_being_considered,
    notes_on_locations,
  } = values

  return {
    id: profileId,
    investor_company_id: companyId,
    uk_region_locations: transformValueToId(uk_region_locations),
    other_countries_being_considered: transformValueToId(
      other_countries_being_considered
    ),
    notes_on_locations,
  }
}
