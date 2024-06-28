import { COMPANIES__OVERVIEW_UPCOMING_ACTIVITY_LOADED } from '../../../../../actions'

const defaultState = {
  total: 0,
  page: 1,
  result: [],
  isComplete: false,
}

export default (state = defaultState, { type, result }) => {
  switch (type) {
    case COMPANIES__OVERVIEW_UPCOMING_ACTIVITY_LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    default:
      return state
  }
}
