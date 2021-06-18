import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'

export const ID = 'interactionsList'

import { buildSelectedFilters } from './filters'

const parseQueryString = (queryString) => {
  const queryProps = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryProps,
    page: parseInt(queryProps.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryProps = parseQueryString(queryString)
  const { metadata } = state[ID]
  const selectedFilters = buildSelectedFilters(queryProps, metadata)

  return {
    ...state[ID],
    selectedFilters,
    payload: queryProps,
    optionMetadata: {
      sortOptions: [],
      ...metadata,
    },
  }
}
