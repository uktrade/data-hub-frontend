import { STAGE } from '../../../../components/MyInvestmentProjects/constants'
import { isFieldRequiredForStage } from '../validators'

export const totalInvestmentValidator = (value, foreignEquityInvestment) => {
  if (parseInt(value) < parseInt(foreignEquityInvestment)) {
    return 'Total investment must be >= to capital expenditure'
  }
  return null
}

export const capitalExpenditureValidator = (value) => {
  const minCapitalExpenditure = 15000000
  if (parseInt(value) < minCapitalExpenditure) {
    return 'Capital expenditure must be >= £15,000,000 for capital only project'
  }
  return null
}

export const siteAddressIsCompanyAddressValidator = (
  field,
  formFields,
  project
) => {
  return isFieldRequiredForStage(field.name, project) &&
    !formFields.values[field.name]
    ? "Select if the site address the same as the UK recipient company's address?"
    : null
}

export const isUkRegionLocationsRequiredForStage = (project) => {
  return project?.stage?.id == STAGE.VERIFY_WIN_ID
}
