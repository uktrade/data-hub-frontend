import { parseQueryString } from '../../../../../utils'
import {
  generateFinancialYearLabel,
  getFinancialYearStart,
} from '../../../../../utils/date'
import {
  SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from '../../../../../../apps/investments/client/projects/constants'
import { buildSelectedFilters } from './filters'

export const ASSOCIATE_PROJECT_ID = 'associateProject'
export const TASK_UPDATE_ASSOCIATED_PROJECT = 'TASK_UPDATE_ASSOCIATED_PROJECT'
export const TASK_GET_NON_FDI_PROJECTS_LIST = 'TASK_GET_NON_FDI_PROJECTS_LIST'
export const NON_FDI_LIST_ID = 'nonFdiProjectsList'

export const state2props = ({ router, ...state }) => {
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

  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    financialYearOptions
  )

  return {
    ...state[NON_FDI_LIST_ID],
    payload: { ...queryParams },
    selectedFilters,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      projectStatusOptions: PROJECT_STATUS_OPTIONS,
      financialYearOptions,
      ...metadata,
    },
  }
}
