import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__SORT_CHANGE,
  MY_INVESTMENTS__STAGE_CHANGE,
  MY_INVESTMENTS__STATUS_CHANGE,
  MY_INVESTMENTS__PAGINATION_CLICK,
  MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
} from '../../actions'

const ALL_STAGES = 'all-stages'
const ALL_STATUSES = 'all-statuses'
const DEFAULT_SORT = 'created_on:desc'

const initialState = {
  count: 0,
  results: [],
  summary: [],
  itemsPerPage: 10,
  page: 1,
  sort: DEFAULT_SORT,
  stage: ALL_STAGES,
  status: ALL_STATUSES,
  showDetails: false,
}

export default (
  state = initialState,
  { type, result, page, stage, status, sort, showDetails }
) => {
  switch (type) {
    case MY_INVESTMENTS__LIST_LOADED:
      const { results, count, summary } = result
      return {
        ...state,
        results,
        count,
        summary,
      }
    case MY_INVESTMENTS__SORT_CHANGE:
      return { ...state, sort, page }
    case MY_INVESTMENTS__STAGE_CHANGE:
      return { ...state, stage, page }
    case MY_INVESTMENTS__STATUS_CHANGE:
      return { ...state, status, page }
    case MY_INVESTMENTS__PAGINATION_CLICK:
      return { ...state, page }
    case MY_INVESTMENTS__SHOW_DETAILS_CHANGE:
      return { ...state, showDetails }
    default:
      return state
  }
}
