import { FILES__LOADED } from '../../../actions'

const initialState = {
  results: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case FILES__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    default:
      return state
  }
}
