import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { SORT_OPTIONS } from '../../Contacts/CollectionList/constants'
import { buildSelectedFilters } from './filters'

export const TASK_SEARCH_ATTENDEE = 'TASK_SEARCH_ATTENDEE'
export const TASK_GET_ATTENDEE_METADATA = 'TASK_GET_ATTENDEE_METADATA'
export const SEARCH_ATTENDEE_ID = 'findAttendees'

const getQueryParams = (router) => {
  const queryString = router.location.search.slice(1)
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParams(router)
  const metadata = state[SEARCH_ATTENDEE_ID].metadata
  const selectedFilters = buildSelectedFilters(queryParams, metadata)

  return {
    ...state[SEARCH_ATTENDEE_ID],
    payload: {
      ...queryParams,
    },
    selectedFilters,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
  }
}
