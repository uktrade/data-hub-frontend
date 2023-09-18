import { parseQueryString } from '../../../utils'
import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../utils/date'
import {
  buildSelectedCompanyFilters,
  buildSelectedInvestmentFilters,
} from './filters'
import {
  SORT_OPTIONS as INVESTMENT_SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from '../../../../apps/investments/client/projects/constants'
import { transformPostcodeToApi } from '../../Companies/CollectionList/transformers'
import {
  SORT_OPTIONS as COMPANY_SORT_OPTIONS,
  COMPANY_STATUS_OPTIONS,
} from '../../Companies/CollectionList/constants'

export const TASK_EDIT_INVESTMENT_PROJECT_SUMMARY =
  'TASK_EDIT_INVESTMENT_PROJECT_SUMMARY'
export const TASK_EDIT_INVESTMENT_PROJECT_REQUIREMENTS =
  'TASK_EDIT_INVESTMENT_PROJECT_REQUIREMENTS'
export const TASK_EDIT_INVESTMENT_PROJECT_VALUE =
  'TASK_EDIT_INVESTMENT_PROJECT_VALUE'
export const TASK_EDIT_INVESTMENT_PROJECT_STATUS =
  'TASK_EDIT_INVESTMENT_PROJECT_VALUE'
export const TASK_UPDATE_INVESTMENT_PROJECT_STAGE =
  'TASK_UPDATE_INVESTMENT_PROJECT_STAGE'
export const TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER =
  'TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER'
export const TASK_SAVE_INVESTMENT_PROJECT_MANAGERS =
  'TASK_SAVE_INVESTMENT_PROJECT_MANAGERS'
export const TASK_EDIT_PROJECT_TEAM_MEMBERS = 'TASK_EDIT_PROJECT_TEAM_MEMBERS'

export const TASK_GET_NON_FDI_PROJECTS_LIST = 'TASK_GET_NON_FDI_PROJECTS_LIST'
export const TASK_UPDATE_ASSOCIATED_PROJECT = 'TASK_UPDATE_ASSOCIATED_PROJECT'
export const TASK_GET_UK_COMPANIES = 'TASK_GET_UK_COMPANIES'
export const TASK_UPDATE_RECIPIENT_COMPANY = 'TASK_UPDATE_RECIPIENT_COMPANY'

export const NON_FDI_LIST_ID = 'nonFdiProjectsList'
export const ASSOCIATE_PROJECT_ID = 'associateProject'
export const RECIPIENT_COMPANY_LIST_ID = 'recipientCompanyList'
export const RECIPIENT_COMPANY_ID = 'RECIPIENT_COMPANY_ID'

export const state2props = (state) => {
  return { currentAdviserId: state.currentAdviserId }
}

export const nonFdiState2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)

  const queryParams = parseQueryString(queryString)
  const { metadata } = state[NON_FDI_LIST_ID]
  const financialYearStart = getFinancialYearStart(new Date())
  const financialYearOptions = [
    {
      label: `Current year ${generateFinancialYearLabel(financialYearStart)}`,
      value: `${financialYearStart}`,
    },
    {
      label: `Last year ${generateFinancialYearLabel(financialYearStart - 1)}`,
      value: `${financialYearStart - 1}`,
    },
    {
      label: `Next year ${generateFinancialYearLabel(financialYearStart + 1)}`,
      value: `${financialYearStart + 1}`,
    },
  ]

  const selectedFilters = buildSelectedInvestmentFilters(
    queryParams,
    metadata,
    financialYearOptions
  )

  return {
    ...state[NON_FDI_LIST_ID],
    payload: { ...queryParams },
    selectedFilters,
    optionMetadata: {
      sortOptions: INVESTMENT_SORT_OPTIONS,
      projectStatusOptions: PROJECT_STATUS_OPTIONS,
      financialYearOptions,
      ...metadata,
    },
  }
}

export const recipientState2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const ukPostcode = transformPostcodeToApi(queryParams.uk_postcode)

  const { metadata } = state[RECIPIENT_COMPANY_LIST_ID]

  const selectedFilters = buildSelectedCompanyFilters(queryParams, metadata)

  return {
    ...state[RECIPIENT_COMPANY_LIST_ID],
    payload: {
      ...queryParams,
      uk_postcode: ukPostcode,
    },
    optionMetadata: {
      sortOptions: COMPANY_SORT_OPTIONS,
      companyStatusOptions: COMPANY_STATUS_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
