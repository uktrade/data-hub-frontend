import { EVENTS__STOVA_DETAILS_LOADED } from '../../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EVENTS__STOVA_DETAILS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
