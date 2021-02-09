import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
  INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED,
} from '../../../../client/actions'

import { transformLargeCapitalProfiles } from '../../transformers/profiles'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
  filterOptions: {
    countries: [],
  },
}

export default (state = initialState, { type, page, result }) => {
  switch (type) {
    case INVESTMENTS__PROFILES_LOADED:
      return {
        ...state,
        count: result.count,
        // FIXME: The transformation should be moved to the task
        results: result?.results?.map(transformLargeCapitalProfiles),
        isComplete: true,
      }
    case INVESTMENTS__PROFILES_SELECT_PAGE:
      return {
        ...state,
        page,
      }
    case INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED:
      return {
        ...state,
        filterOptions: result,
      }
    default:
      return state
  }
}
