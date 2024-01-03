import { EXPORT_WINS__DETAILS_LOADED } from '../../../actions'

const initialState = {
  exportWin: {},
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EXPORT_WINS__DETAILS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
