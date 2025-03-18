import { SORT_OPTIONS } from './constants'
import { parseQueryString } from '../../../utils'

export const FILES_LIST_ID = 'filesList'

export const TASK_GET_FILES_LIST = 'TASK_GET_FILES_LIST'

export const filesState2props = ({ router, ...state }) => {
  return {
    ...state[FILES_LIST_ID],
    payload: {
      ...parseQueryString(router.location.search.slice(1)),
    },
    selectedFilters: {},
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
    },
  }
}
