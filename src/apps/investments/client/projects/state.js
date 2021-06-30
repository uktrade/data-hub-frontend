import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { buildFilters } from './filters'

import {
  SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  INVOLVEMENT_LEVEL_OPTIONS,
} from './constants'

export const ID = 'projectsList'
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

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const { metadata, selectedAdvisers } = state[ID]
  const selectedFilters = buildFilters(queryParams, metadata, selectedAdvisers)

  return {
    ...state[ID],
    payload: { ...queryParams },
    selectedFilters,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      projectStatusOptions: PROJECT_STATUS_OPTIONS,
      involvementLevelOptions: INVOLVEMENT_LEVEL_OPTIONS,
      ...metadata,
    },
  }
}
