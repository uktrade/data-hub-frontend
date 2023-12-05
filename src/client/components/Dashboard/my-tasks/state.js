import { omitBy, isEmpty } from 'lodash'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { parsePage } from '../../../../client/utils/pagination'

import { CREATED_BY_LIST_OPTIONS } from './constants'

export const ID = 'getMyTasks'
export const TASK_GET_MY_TASKS = 'TASK_GET_MY_TASKS'

const areFiltersActive = (queryParams) => {
  const filters = omitBy(
    queryParams,
    (filterValue, filterName) =>
      filterValue === 'all-statuses' || filterName === 'page'
  )

  return !isEmpty(filters)
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParamsFromLocation(router.location)
  const { currentAdviserId } = state
  const payload = {
    ...queryParams,
    page: parsePage(queryParams.page),
    created_by: undefined,
    adviser: [currentAdviserId],
  }
  if (queryParams.created_by === 'me') {
    payload.created_by = currentAdviserId
  }

  if (queryParams.created_by === 'others') {
    payload.created_by = undefined
  }
  return {
    ...state[ID],
    payload: payload,
    filters: {
      areActive: areFiltersActive(queryParams),
      createdBy: {
        options: CREATED_BY_LIST_OPTIONS,
      },
    },
  }
}
