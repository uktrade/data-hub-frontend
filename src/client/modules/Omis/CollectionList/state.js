import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS, STATUSES } from './constants'

export const ORDERS_LIST_ID = 'ordersList'
export const COMPANY_ORDERS_LIST_ID = 'companyOrdersList'

export const TASK_GET_ORDERS_LIST = 'TASK_GET_ORDERS_LIST'
export const TASK_GET_ORDERS_METADATA = 'TASK_GET_ORDERS_METADATA'

const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const ordersState2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const { metadata } = state[ORDERS_LIST_ID]
  const selectedFilters = buildSelectedFilters(queryParams, metadata)
  return {
    ...state[ORDERS_LIST_ID],
    payload: { ...queryParams },
    selectedFilters,
    optionMetadata: {
      ...metadata,
      sortOptions: SORT_OPTIONS,
      statusOptions: STATUSES,
    },
  }
}

export const companyOrdersState2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  return {
    ...state[COMPANY_ORDERS_LIST_ID],
    payload: { ...queryParams },
    selectedFilters: {},
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      statusOptions: STATUSES,
    },
  }
}
