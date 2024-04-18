import { EVENT_ATTENDEES_MAPPING } from '../../../../apps/companies/apps/activity-feed/constants'
import { locationToQSParamsWithPage } from '../../../utils/url'

export const TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES =
  'TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES'

export const ID = 'eventAventriRegistrationStatusAttendees'

export const mapUrlSlugToRegistrationStatus = (urlSlug) => {
  const status = Object.entries(EVENT_ATTENDEES_MAPPING).find(
    ([, value]) => value.urlSlug == urlSlug
  )
  return Array.isArray(status) ? status[0] : null
}

export const state2props = (state, { match, location }) => {
  const queryParams = locationToQSParamsWithPage(location)
  const selectedSortBy = queryParams.sortby || 'first_name:asc'

  const registrationStatus = mapUrlSlugToRegistrationStatus(match.params.status)

  return {
    payload: { ...queryParams, selectedSortBy },
    page: queryParams.page,
    registrationStatus: registrationStatus,
    aventriEventId: match.params.aventriEventId,
    ...state[ID],
  }
}
