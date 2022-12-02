import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'
import {
  EVENT_AVENTRI_ATTENDEES_MAPPING,
  EVENT_AVENTRI_ATTENDEES_STATUS,
} from '../../../../apps/companies/apps/activity-feed/constants'

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
  console.log(`match.params: ${JSON.stringify(match.params)}`)
  const queryString = location.search.slice(1)
  console.log(queryString)
  const queryParams = parseQueryString(queryString)
  console.log(`match.params: ${JSON.stringify(queryParams)}`)
  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'
  console.log(EVENT_AVENTRI_ATTENDEES_MAPPING)
  let registrationStatus
  const aventriRegistrationStatuses = Object.entries(
    EVENT_AVENTRI_ATTENDEES_MAPPING
  ).reduce((status, item) => {
    if (item[1].urlSlug == match.params.status) {
      console.log(item)
      registrationStatus = item[1].status
      status.push(item[0])
    }
    return status
  }, [])

  console.log(aventriRegistrationStatuses)
  console.log(registrationStatus)

  // console.log()
  return {
    payload: { ...queryParams, selectedSortBy },
    page: queryParams.page,
    registrationStatus,
    aventriEventId: match.params.aventriEventId,
    aventriRegistrationStatuses: aventriRegistrationStatuses,
    ...state[ID],
  }
}
