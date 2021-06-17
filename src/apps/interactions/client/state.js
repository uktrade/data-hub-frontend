import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'

export const ID = 'interactionsList'

import { buildSelectedFilters } from './filters'

const parseQueryString = (queryString) => {
  const queryStringObject = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryStringObject,
    page: parseInt(queryStringObject.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryStringObject = parseQueryString(queryString)
  const { metadata } = state[ID]
  const selectedFilters = buildSelectedFilters(queryStringObject, metadata)

  return {
    ...state[ID],
    selectedFilters,
    payload: queryStringObject,
    optionMetadata: {
      sortOptions: [],
      ...metadata,
    },
  }
}
