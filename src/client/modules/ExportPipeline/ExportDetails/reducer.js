import { EXPORT_LOADED } from '../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EXPORT_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
