import { CONTACTS__INTERACTIONS_LOADED } from '../../../client/actions'

const defaultState = { activities: null }

export default (state = defaultState, { type, result }) => {
  switch (type) {
    case CONTACTS__INTERACTIONS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
