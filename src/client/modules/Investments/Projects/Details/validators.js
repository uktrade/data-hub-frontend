import { STAGE } from '../../../../components/MyInvestmentProjects/constants'
import { isFieldRequiredForStage } from '../validators'

const { OPTION_YES } = require('../../../../../common/constants')

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

export const siteDecidedValidator = (field, formFields, project) => {
  if (project?.stage?.id == STAGE.ACTIVE_ID && !formFields.values[field.name]) {
    return 'Select a value for UK location decision'
  }
  return isFieldRequiredForStage(field.name, project) &&
    formFields.values[field.name] != OPTION_YES
    ? 'A UK region is required'
    : null
}

export const isUkRegionLocationsRequiredForStage = (project) => {
  return project?.stage?.id == STAGE.VERIFY_WIN_ID || STAGE.ACTIVE_ID
}
