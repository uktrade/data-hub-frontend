import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../utils/date'
import { parseQueryString } from '../../../utils'
import { buildSelectedFilters } from './filters'
import {
  SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  INVOLVEMENT_LEVEL_OPTIONS,
} from './constants'

export const TASK_EDIT_INVESTMENT_PROJECT_STATUS =
  'TASK_EDIT_INVESTMENT_PROJECT_STATUS'
export const TASK_UPDATE_INVESTMENT_PROJECT_STAGE =
  'TASK_UPDATE_INVESTMENT_PROJECT_STAGE'

export const INVESTMENT_PROJECTS_ID = 'projectsList'
export const INVESTMENT_PROJECT_ID = 'investmentProject'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME =
  'TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME'
export const TASK_GET_INVESTMENTS_PROJECTS_METADATA =
  'TASK_GET_INVESTMENTS_PROJECTS_METADATA'
export const TASK_GET_INVESTMENT_PROJECT = 'TASK_GET_INVESTMENT_PROJECT'

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)

  const queryParams = parseQueryString(queryString)
  const { metadata, selectedAdvisers } = state[INVESTMENT_PROJECTS_ID]
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

  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    selectedAdvisers,
    financialYearOptions
  )

  queryParams.include_parent_companies =
    selectedFilters.includeRelatedCompanies.options.some(
      (f) => f.value === 'include_parent_companies'
    )
  queryParams.include_subsidiary_companies =
    selectedFilters.includeRelatedCompanies.options.some(
      (f) => f.value === 'include_subsidiary_companies'
    )

  return {
    ...state[INVESTMENT_PROJECTS_ID],
    currentAdviserId: state.currentAdviserId,
    payload: { ...queryParams },
    selectedFilters,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      projectStatusOptions: PROJECT_STATUS_OPTIONS,
      involvementLevelOptions: INVOLVEMENT_LEVEL_OPTIONS,
      financialYearOptions,
      ...metadata,
    },
  }
}

export const investmentProjectState2props = (state) => ({
  ...state[INVESTMENT_PROJECT_ID],
})
