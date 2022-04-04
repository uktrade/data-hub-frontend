import {
  CONTACTS__INTERACTIONS_LOADED,
  CONTACTS__INTERACTIONS_PAGINATION_CLICKED,
} from '../../../client/actions'

const defaultState = { activities: null, total: 0, page: 1 }

export default (state = defaultState, { type, result, page }) => {
  switch (type) {
    case CONTACTS__INTERACTIONS_LOADED:
      return {
        ...state,
        ...result,
      }
    case CONTACTS__INTERACTIONS_PAGINATION_CLICKED:
      return { ...state, page }
    default:
      return state
  }
}
