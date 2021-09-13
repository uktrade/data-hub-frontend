import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { buildSelectedFilters } from './filters'
import { transformArchivedToApi } from './transformers'
import { STATUS_OPTIONS, SORT_OPTIONS } from './constants'

export const CONTACTS_LIST_ID = 'contactsList'
export const COMPANY_CONTACTS_LIST_ID = 'companyContactsList'

export const TASK_GET_CONTACTS_LIST = 'TASK_GET_CONTACTS_LIST'
export const TASK_GET_CONTACTS_METADATA = 'TASK_GET_CONTACTS_METADATA'

const getQueryParams = (router) => {
  const queryString = router.location.search.slice(1)
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const contactsState2props = ({ router, ...state }) => {
  const queryParams = getQueryParams(router)
  const metadata = state[CONTACTS_LIST_ID].metadata
  const selectedFilters = buildSelectedFilters(queryParams, metadata)
  const archived = transformArchivedToApi(queryParams.archived)

  return {
    ...state[CONTACTS_LIST_ID],
    payload: {
      ...queryParams,
      archived,
    },
    selectedFilters,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      statusOptions: STATUS_OPTIONS,
      ...metadata,
    },
  }
}

export const companyContactsState2props = ({ router, ...state }) => {
  const queryParams = getQueryParams(router)
  const archived = transformArchivedToApi(queryParams.archived)

  return {
    ...state[COMPANY_CONTACTS_LIST_ID],
    payload: {
      ...queryParams,
      archived,
    },
    selectedFilters: {},
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
    },
  }
}
