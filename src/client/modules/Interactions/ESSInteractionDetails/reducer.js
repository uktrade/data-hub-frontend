import { INTERACTION__ESS_DETAILS_LOADED } from '../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case INTERACTION__ESS_DETAILS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
