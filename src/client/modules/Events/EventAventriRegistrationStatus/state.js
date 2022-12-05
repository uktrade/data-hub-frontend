import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'
import { EVENT_AVENTRI_ATTENDEES_MAPPING } from '../../../../apps/companies/apps/activity-feed/constants'

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
  const { match, location } = router
  const queryString = location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'

  let registrationStatus = null

  const aventriRegistrationStatuses = Object.entries(
    EVENT_AVENTRI_ATTENDEES_MAPPING
  ).reduce((status, item) => {
    if (item[1].urlSlug == match.params.status) {
      registrationStatus = item[1].status
      status.push(item[0])
    }
    return status
  }, [])

  return {
    payload: { ...queryParams, selectedSortBy },
    page: queryParams.page,
    registrationStatus,
    aventriEventId: match.params.aventriEventId,
    aventriRegistrationStatuses: aventriRegistrationStatuses,
    ...state[ID],
  }
}
