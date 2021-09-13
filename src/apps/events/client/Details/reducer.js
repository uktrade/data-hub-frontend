import { EVENTS__DETAILS_LOADED } from '../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EVENTS__DETAILS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
