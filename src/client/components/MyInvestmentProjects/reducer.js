import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__PAGINATION_CLICK,
  MY_INVESTMENTS__FILTER_CHANGE,
  MY_INVESTMENTS__SORT_CHANGE,
} from '../../actions'

const initialState = {
  count: 0,
  results: [],
  itemsPerPage: 10,
  page: 1,
  sort: 'created_on:desc',
  filter: 'all-stages',
}

export default (state = initialState, { type, result, page, filter, sort }) => {
  switch (type) {
    case MY_INVESTMENTS__LIST_LOADED:
      const { results, count } = result
      return {
        ...state,
        results,
        count,
      }
    case MY_INVESTMENTS__PAGINATION_CLICK:
      return { ...state, page }
    case MY_INVESTMENTS__FILTER_CHANGE:
      return { ...state, filter, page }
    case MY_INVESTMENTS__SORT_CHANGE:
      return { ...state, sort, page }
    default:
      return state
  }
}
