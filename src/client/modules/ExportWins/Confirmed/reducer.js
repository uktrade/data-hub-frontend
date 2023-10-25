import { EXPORT_WINS__CONFIRMED_LOADED } from '../../../actions'

const initialState = {
  results: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EXPORT_WINS__CONFIRMED_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
