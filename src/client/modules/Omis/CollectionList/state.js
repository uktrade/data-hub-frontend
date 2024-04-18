import { buildSelectedFilters } from './filters'
import {
  SORT_OPTIONS,
  RECONCILIATION_SORT_OPTIONS,
  STATUSES,
  RECONCILIATION_STATUSES,
} from './constants'
import { locationToQSParamsWithPage } from '../../../utils/url'

export const ORDERS_LIST_ID = 'ordersList'
export const COMPANY_ORDERS_LIST_ID = 'companyOrdersList'
export const ORDERS_RECONCILIATION_LIST_ID = 'reconciliationOrdersList'

export const TASK_GET_ORDERS_LIST = 'TASK_GET_ORDERS_LIST'
export const TASK_GET_ORDERS_METADATA = 'TASK_GET_ORDERS_METADATA'
export const TASK_GET_ORDERS_RECONCILIATION = 'TASK_GET_ORDERS_RECONCILIATION'
export const TASK_GET_ORDERS_RECONCILIATION_METADATA =
  'TASK_GET_ORDERS_RECONCILIATION_METADATA'

export const ordersState2props = ({ router, ...state }) => {
  const queryParams = locationToQSParamsWithPage(router.location)
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
  const queryParams = locationToQSParamsWithPage(router.location)
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

export const reconciliationOrdersState2props = ({ router, ...state }) => {
  const queryParams = locationToQSParamsWithPage(router.location)
  const { metadata } = state[ORDERS_RECONCILIATION_LIST_ID]
  const selectedFilters = buildSelectedFilters(queryParams, metadata)
  return {
    ...state[ORDERS_RECONCILIATION_LIST_ID],
    payload: { ...queryParams },
    selectedFilters,
    optionMetadata: {
      ...metadata,
      sortOptions: RECONCILIATION_SORT_OPTIONS,
      statusOptions: RECONCILIATION_STATUSES,
    },
  }
}
