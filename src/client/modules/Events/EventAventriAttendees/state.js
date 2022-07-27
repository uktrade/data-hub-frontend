import qs from 'qs'

export const TASK_GET_EVENT_AVENTRI_ATTENDEES =
  'TASK_GET_EVENT_AVENTRI_ATTENDEES'

export const ID = 'eventAventriAttendees'

export const state2props = ({ ...state }) => {
  const selectedSortBy =
    qs.parse(location.search.slice(1)).sortby || 'first_name:asc'

  const selectedPage = qs.parse(location.search.slice(1)).page || '1'

  return {
    selectedSortBy,
    selectedPage,
    ...state[ID],
  }
}
