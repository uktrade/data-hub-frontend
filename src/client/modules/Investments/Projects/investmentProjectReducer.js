import { INVESTMENT__PROJECT_LOADED } from '../../../actions'

const initialState = {
  project: undefined,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT__PROJECT_LOADED:
      return {
        ...state,
        project: result,
      }
    default:
      return state
  }
}
