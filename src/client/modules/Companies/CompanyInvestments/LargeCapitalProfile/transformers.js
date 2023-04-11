import {
  transformOption,
  transformDateObjectToDateString,
} from '../../../../transformers'

const checkCurrencyField = (currencyField) =>
  currencyField || currencyField <= 0 ? currencyField : null

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
