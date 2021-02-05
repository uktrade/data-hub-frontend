import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__PAGE_SELECTED,
} from '../../actions'

const initialState = {
  count: 0,
  results: [],
  itemsPerPage: 10,
  page: 1,
}

export default (state = initialState, { type, result, page }) => {
  switch (type) {
    case MY_INVESTMENTS__LIST_LOADED:
      const { results, count } = result
      return {
        ...state,
        results,
        count,
      }
    case MY_INVESTMENTS__PAGE_SELECTED:
      return {
        ...state,
        page,
      }
    default:
      return state
  }
}
