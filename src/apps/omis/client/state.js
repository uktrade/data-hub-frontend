import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { buildFilters } from './filters'
import { SORT_OPTIONS, STATUSES } from './constants'

export const ID = 'ordersList'
export const TASK_GET_ORDERS_LIST = 'TASK_GET_ORDERS_LIST'
export const TASK_GET_ORDERS_METADATA = 'TASK_GET_ORDERS_METADATA'

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
  const { metadata } = state[ID]
  const selectedFilters = buildFilters(queryParams, metadata)
  return {
    ...state[ID],
    payload: { ...queryParams },
    optionMetadata: {
      ...metadata,
      sortOptions: SORT_OPTIONS,
      statusOptions: STATUSES,
    },
    selectedFilters,
  }
}
