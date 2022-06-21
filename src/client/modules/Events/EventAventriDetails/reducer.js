import { EVENTS__AVENTRI_DETAILS_LOADED } from '../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EVENTS__AVENTRI_DETAILS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
