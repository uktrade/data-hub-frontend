import {
  COMPANIES__GLOBAL_ULTIMATE_LOADED,
  DNB__CHECK_PENDING_REQUEST,
} from '../../../../../client/actions'

export default (
  state = {
    isDnbPending: false,
    globalUltimate: false,
  },
  { type, result }
) => {
  switch (type) {
    case DNB__CHECK_PENDING_REQUEST:
      return { ...state, isDnbPending: result }
    case COMPANIES__GLOBAL_ULTIMATE_LOADED:
      return {
        ...state,
        globalUltimate: result ? result.data.results[0] : null,
      }
    default:
      return state
  }
}
