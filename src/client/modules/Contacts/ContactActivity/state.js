import qs from 'qs'

export const TASK_GET_CONTACT_ACTIVITIES = 'TASK_GET_CONTACT_ACTIVITIES'

export const ID = 'contactActivity'

export const state2props = ({ ...state }) => {
  const selectedSortBy = qs.parse(location.search.slice(1)).sortby || 'newest'
  const page = qs.parse(location.search.slice(1)).page || '1'

  return {
    ...state[ID],
    page,
    selectedSortBy,
  }
}
