import {
  INVESTMENTS__EYB_LEADS_LOADED,
  INVESTMENTS__EYB_LEAD_FILTER_OPTIONS_LOADED,
} from '../../../actions'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
  filterOptions: {
    sectors: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENTS__EYB_LEADS_LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results,
        isComplete: true,
      }
    case INVESTMENTS__EYB_LEAD_FILTER_OPTIONS_LOADED:
      return {
        ...state,
        filterOptions: result,
      }
    default:
      return state
  }
}
