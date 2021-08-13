import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_EVENTS_LIST = 'TASK_GET_EVENTS_LIST'
export const TASK_GET_EVENTS_METADATA = 'TASK_GET_EVENTS_METADATA'
export const TASK_GET_EVENTS_ORGANISER_NAME = 'TASK_GET_EVENTS_ORGANISER_NAME'
export const TASK_GET_EVENT_DETAILS = 'TASK_GET_EVENT_DETAILS'

export const ID = 'eventsList'

import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from './constants'

const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

/**
 * Convert both location and redux state to props
 */
export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)

  const { metadata, selectedOrganisers } = state[ID]

  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    selectedOrganisers
  )

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
