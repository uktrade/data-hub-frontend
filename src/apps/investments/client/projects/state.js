import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../../client/utils/date'

import { buildSelectedFilters } from './filters'

import {
  SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  INVOLVEMENT_LEVEL_OPTIONS,
} from './constants'

export const INVESTMENT_PROJECTS_ID = 'projectsList'
export const COMPANY_PROJECTS_LIST_ID = 'companyProjectsList'
export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME =
  'TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME'
export const TASK_GET_INVESTMENTS_PROJECTS_METADATA =
  'TASK_GET_INVESTMENTS_PROJECTS_METADATA'

const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const projectsState2props = ({ router, ...state }) => {
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

  return {
    ...state[INVESTMENT_PROJECTS_ID],
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

export const companyProjectsState2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)

  return {
    ...state[COMPANY_PROJECTS_LIST_ID],
    payload: { ...queryParams },
    selectedFilters: {},
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
    },
  }
}
