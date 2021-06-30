import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'
export const TASK_GET_INTERACTIONS_ADVISER_NAME =
  'TASK_GET_INTERACTIONS_ADVISER_NAME'
export const TASK_GET_INTERACTIONS_METADATA = 'TASK_GET_INTERACTIONS_METADATA'

export const ID = 'interactionsList'

import { buildFilters } from './filters'
import { SORT_OPTIONS } from './constants'

const parseQueryString = (queryString) => {
  const queryProps = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryProps,
    page: parseInt(queryProps.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const { metadata, selectedAdvisers } = state[ID]
  const selectedFilters = buildFilters(queryParams, metadata, selectedAdvisers)

  return {
    ...state[ID],
    payload: queryParams,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
