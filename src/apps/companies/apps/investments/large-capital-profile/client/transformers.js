import {
  transformDateObjectToDateString,
  transformOption,
} from '../../../../../../client/transformers'

export const transformIdNameToValueLabel = (values = []) => {
  return values.map((value) => ({ label: value.text, value: value.value }))
}

export const transformObjectToValueLabel = (obj) => {
  return obj ? { label: obj.text, value: obj.value } : null
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
    global_assets_under_management,
    investable_capital,
    notes_on_locations: investor_notes,
    required_checks_conducted: required_checks,
    required_checks_conducted_on: transformDateObjectToDateString(date),
    required_checks_conducted_by: transformOption(adviser),
  }
}
