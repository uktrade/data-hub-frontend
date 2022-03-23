import { CONTACTS__INTERACTION_LIST_LOADED } from '../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case CONTACTS__INTERACTION_LIST_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
