import { COMPANIES__LOADED } from '../../../client/actions'

const initialState = {
  results: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANIES__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    default:
      return state
  }
}
