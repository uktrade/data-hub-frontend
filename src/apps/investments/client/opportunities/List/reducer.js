import {
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../../client/actions'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
}

export default (state = initialState, { type, page, result }) => {
  switch (type) {
    case INVESTMENTS__OPPORTUNITIES_LOADED:
      return {
        ...state,
        count: result.count,
        results: result?.results,
        isComplete: true,
      }
    // TODO: Remove this after the feature flag capital-investments-filters
    // is removed
    case INVESTMENTS__OPPORTUNITIES_SELECT_PAGE:
      return {
        ...state,
        page,
      }
    default:
      return state
  }
}
