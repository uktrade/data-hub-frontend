import { EXPORT__PIPELINE_LIST_LOADED } from '../../../../client/actions'

const initialState = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EXPORT__PIPELINE_LIST_LOADED:
      return {
        ...result,
      }
    default:
      return state
  }
}
