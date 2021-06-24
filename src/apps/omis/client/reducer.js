import { ORDERS__LOADED } from '../../../client/actions'

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
    default:
      return state
  }
}
