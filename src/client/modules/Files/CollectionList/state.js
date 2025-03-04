import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { SORT_OPTIONS } from './constants'

export const FILES_LIST_ID = 'filesList'

export const TASK_GET_FILES_LIST = 'TASK_GET_FILES_LIST'

const getQueryParams = (router) => {
  const queryString = router.location.search.slice(1)
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const filesState2props = ({ router, ...state }) => {
  const queryParams = getQueryParams(router)

  return {
    ...state[FILES_LIST_ID],
    payload: {
      ...queryParams,
    },
    selectedFilters: {},
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
    },
  }
}
