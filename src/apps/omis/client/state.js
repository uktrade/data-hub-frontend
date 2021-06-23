import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from './constants'

export const ID = 'ordersList'
export const TASK_GET_ORDERS_LIST = 'TASK_GET_ORDERS_LIST'

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
  const selectedFilters = buildSelectedFilters({
    queryParams,
    metadata,
  })
  return {
    ...state[ID],
    payload: { ...queryParams },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
