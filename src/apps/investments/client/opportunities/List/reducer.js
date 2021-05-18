import {
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../../client/actions'

const initialState = {
  results: [],
  isComplete: false,
  count: 0,
  activePage: 1,
}

export default (state = initialState, { type, page, result }) => {
  switch (type) {
    case INVESTMENTS__OPPORTUNITIES_LOADED:
      const { count, results } = result
      return {
        ...state,
        count,
        results,
        isComplete: true,
      }
    // TODO: Remove this after the feature flag capital-investments-filters
    // is removed
    case INVESTMENTS__OPPORTUNITIES_SELECT_PAGE:
      return {
        ...state,
        activePage: page,
      }
    default:
      return state
  }
}
