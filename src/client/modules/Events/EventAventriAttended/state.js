import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_EVENT_AVENTRI_ATTENDED = 'TASK_GET_EVENT_AVENTRI_ATTENDED'

export const ID = 'eventAventriAttended'

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

  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'

  return {
    payload: { ...queryParams, selectedSortBy },
    page: queryParams.page,
    ...state[ID],
  }
}
