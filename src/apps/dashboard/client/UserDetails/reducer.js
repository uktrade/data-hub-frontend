import { USER_DETAILS_LOADED } from '../../../../client/actions'

const initialState = {}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case USER_DETAILS_LOADED:
      return {
        ...state,
        items: [...result],
      }
    default:
      return state
  }
}
