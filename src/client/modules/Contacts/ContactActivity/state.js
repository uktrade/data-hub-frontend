import { getQueryParamsFromLocation } from '../../../utils/url'

export const TASK_GET_CONTACT_ACTIVITIES = 'TASK_GET_CONTACT_ACTIVITIES'

export const ID = 'contactActivity'

export const state2props = ({ ...state }) => {
  const selectedSortBy = getQueryParamsFromLocation(location).sortby || 'newest'
  const page = getQueryParamsFromLocation(location).page || '1'

  return {
    ...state[ID],
    page: parseInt(page, 10),
    selectedSortBy,
  }
}
