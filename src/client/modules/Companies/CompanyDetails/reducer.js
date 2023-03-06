import { COMPANY_LOADED } from '../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case COMPANY_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
