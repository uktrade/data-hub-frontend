import { CONTACTS__LOADED } from '../../../client/actions'

const initialState = {
  results: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case CONTACTS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    default:
      return state
  }
}
