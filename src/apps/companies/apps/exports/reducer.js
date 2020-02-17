import {
  EXPORTS_HISTORY,
  EXPORTS_HISTORY__CLICK,
} from '../../../../client/actions'

const initialState = {
  loading: true,
  count: 0,
  results: [],
  activePage: 1,
}

export default (state = initialState, { type, result, page }) => {
  switch (type) {
    case EXPORTS_HISTORY:
      const { count, results } = result
      return {
        ...state,
        loading: false,
        count,
        results,
      }
    case EXPORTS_HISTORY__CLICK:
      return {
        ...state,
        activePage: page,
      }
    default:
      return state
  }
}
