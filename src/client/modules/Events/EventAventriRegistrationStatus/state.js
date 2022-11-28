import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'
import { EVENT_AVENTRI_ATTENDEES_STATUS } from '../../../../apps/companies/apps/activity-feed/constants'

export const TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES =
  'TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES'

export const ID = 'eventAventriRegistrationStatusAttendees'

const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const state2props = (state, router) => {
  // console.log(state)
  const { match, location } = router
  console.log(`match.params: ${JSON.stringify(match.params)}`)
  // console.log(location)
  const queryString = location.search.slice(1)
  const queryParams = parseQueryString(queryString)

  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'
  return {
    payload: { ...queryParams, selectedSortBy },
    page: queryParams.page,
    aventriEventId: match.params.aventriEventId,
    aventriRegistrationStatuses: [
      EVENT_AVENTRI_ATTENDEES_STATUS.activated,
      EVENT_AVENTRI_ATTENDEES_STATUS.confirmed,
    ], //TODO get this from match.params.status via a lookup
    ...state[ID],
  }
}
