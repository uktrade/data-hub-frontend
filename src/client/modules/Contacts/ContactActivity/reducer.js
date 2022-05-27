import { CONTACTS__ACTIVITIES_LOADED } from '../../../actions'

const defaultState = {
  activities: null,
  total: 0,
  page: 1,
  selectedSortBy: 'newest',
}

export default (state = defaultState, { type, result }) => {
  switch (type) {
    case CONTACTS__ACTIVITIES_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
