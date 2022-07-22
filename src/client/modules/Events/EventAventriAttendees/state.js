import qs from 'qs'

export const TASK_GET_EVENT_AVENTRI_ATTENDEES =
  'TASK_GET_EVENT_AVENTRI_ATTENDEES'

export const ID = 'eventAventriAttendees'

export const state2props = ({ ...state }) => {
  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'

  return {
    selectedSortBy,
    ...state[ID],
  }
}
