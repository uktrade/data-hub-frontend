import qs from 'qs'

import { parseQueryString } from '../../../utils'

export const TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES =
  'TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES'

export const ID = 'eventAventriRegistrationStatusAttendees'

export const state2props = ({ router, ...state }) => {
  const { location } = router
  const queryString = location.search.slice(1)

  const queryParams = parseQueryString(queryString)
  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'

  return {
    payload: { ...queryParams, selectedSortBy },
    page: queryParams.page,
    ...state[ID],
  }
}
