import { CONTACTS__ACTIVITIES_LOADED } from '../../../actions'

const defaultState = {
  total: 0,
  page: 1,
  selectedSortBy: 'newest',
  result: [],
  isComplete: false,
}

export default (state = defaultState, { type, result }) => {
  switch (type) {
    case CONTACTS__ACTIVITIES_LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    default:
      return state
  }
}
