import { EXPORT__PIPELINE_LIST_LOADED } from '../../../../client/actions'

const initialState = {
  count: 0,
  results: [],
  sector: [],
  itemsPerPage: 10,
  maxItemsToPaginate: 10000,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EXPORT__PIPELINE_LIST_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
