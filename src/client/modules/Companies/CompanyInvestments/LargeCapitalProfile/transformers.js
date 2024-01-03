import {
  transformOption,
  transformDateObjectToDateString,
} from '../../../../transformers'
import { companies } from '../../../../../lib/urls'

const checkCurrencyField = (currencyField) =>
  currencyField || currencyField <= 0 ? currencyField : null

const checkIfItemHasValue = (item) => (item ? item : null)

const validateRequiredChecks = (requiredChecks) =>
  checkIfItemHasValue(requiredChecks) ? requiredChecks : undefined

const getName = (obj) => obj.name

export const transformArray = (arr = []) => arr.map(getName).join(', ')

export const transformValueToId = (values = []) =>
  values.map((value) => ({ id: value.value }))

export const transformArrayValueToId = (values = []) =>
  values.map((value) => ({ id: value }))

export const transformInitialValuesForCheckbox = (values = []) =>
  values.map((value) => value.id)

export const getReturnLink = (companyId) =>
  companies.investments.largeCapitalProfile(companyId)

export const transformIdForApi = (companyId) => {
  return {
    investor_company: companyId,
  }
}

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
    required_checks_conducted: validateRequiredChecks(required_checks),
    required_checks_conducted_on: transformDateObjectToDateString(date),
    required_checks_conducted_by: adviser
      ? transformOption(adviser)
      : undefined,
  }
}

export const transformInvestorRequirementsToApi = ({
  profileId,
  companyId,
  values,
}) => {
  const {
    asset_classes,
    construction_risk,
    deal_ticket_size,
    desired_deal_role,
    investment_types,
    minimum_equity_percentage,
    minimum_return_rate,
    restrictions,
    time_horizons,
  } = values

  return {
    id: profileId,
    investor_company_id: companyId,
    asset_classes_of_interest: transformValueToId(asset_classes),
    construction_risks: construction_risk,
    deal_ticket_sizes: deal_ticket_size,
    desired_deal_roles: checkIfItemHasValue(desired_deal_role),
    investment_types: checkIfItemHasValue(investment_types),
    minimum_equity_percentage: checkIfItemHasValue(minimum_equity_percentage),
    minimum_return_rate: checkIfItemHasValue(minimum_return_rate),
    restrictions: checkIfItemHasValue(restrictions),
    time_horizons: checkIfItemHasValue(time_horizons),
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
