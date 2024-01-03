import { EXPORT_LOADED } from '../../../../client/actions'

const initialState = { exportItem: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EXPORT_LOADED:
      return {
        ...state,
        exportItem: result,
      }
    default:
      return state
  }
}
