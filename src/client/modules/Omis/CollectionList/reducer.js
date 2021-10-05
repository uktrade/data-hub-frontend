import { ORDERS__LOADED, ORDERS__METADATA_LOADED } from '../../../actions'

const initialState = {
  results: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case ORDERS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case ORDERS__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
