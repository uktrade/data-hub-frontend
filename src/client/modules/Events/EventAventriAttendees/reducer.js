import { EVENTS__AVENTRI_ATTENDEES_LOADED } from '../../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EVENTS__AVENTRI_ATTENDEES_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
