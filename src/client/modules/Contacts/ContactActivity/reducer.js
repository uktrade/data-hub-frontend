import {
  CONTACTS__ACTIVITIES_LOADED,
  CONTACTS__ACTIVITIES_PAGINATION_CLICKED,
} from '../../../actions'

const defaultState = { activities: null, total: 0, page: 1 }

export default (state = defaultState, { type, result, page }) => {
  switch (type) {
    case CONTACTS__ACTIVITIES_LOADED:
      return {
        ...state,
        ...result,
      }
    case CONTACTS__ACTIVITIES_PAGINATION_CLICKED:
      return { ...state, page }
    default:
      return state
  }
}
