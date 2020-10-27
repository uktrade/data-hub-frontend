import {
  EXPORTS_HISTORY__LOADED,
  EXPORTS_HISTORY__SELECT_PAGE,
} from '../../../../../../client/actions'

const initialState = {
  count: 0,
  results: [],
  activePage: 1,
}

export default (state = initialState, { type, result, page }) => {
  switch (type) {
    case EXPORTS_HISTORY__LOADED:
      const { count, results } = result
      return {
        ...state,
        count,
        results,
        isComplete: true,
      }
    case EXPORTS_HISTORY__SELECT_PAGE:
      return {
        ...state,
        activePage: page,
      }
    default:
      return state
  }
}
