import { COMPANIES__LOADED } from '../../../client/actions'

import { transformCompanyToCollectionListItem } from '../transformers'

const initialState = {
  results: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANIES__LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results?.map(transformCompanyToCollectionListItem),
        isComplete: true,
      }
    default:
      return state
  }
}
