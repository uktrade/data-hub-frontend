import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
} from '../../../../client/actions'

import { transformLargeCapitalProfiles } from '../../transformers/profiles'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
}

export default (state = initialState, { type, page, result }) => {
  switch (type) {
    case INVESTMENTS__PROFILES_LOADED:
      return {
        ...state,
        count: result.count,
        results: result?.results?.map(transformLargeCapitalProfiles),
        isComplete: true,
      }
    default:
      return state
  }
}
