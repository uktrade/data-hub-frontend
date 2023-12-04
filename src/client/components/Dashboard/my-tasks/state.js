import { omitBy, isEmpty } from 'lodash'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { parsePage } from '../../../../client/utils/pagination'

import { CREATED_BY_OPTIONS, SHOW_ALL_OPTION } from './constants'

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

// export const state2props = (state) => state[ID]

export const state2props = ({ router }) => {
  const queryParams = getQueryParamsFromLocation(router.location)
  return {
    payload: {
      ...queryParams,
      page: parsePage(queryParams.page),
    },
    filters: {
      areActive: areFiltersActive(queryParams),
      status: {
        options: SHOW_ALL_OPTION,
      },
      createdBy: {
        options: CREATED_BY_OPTIONS,
      },
    },
  }
}
