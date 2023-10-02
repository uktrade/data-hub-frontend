import { INVESTMENT__PROJECT_LOADED } from '../../../actions'
import { deepKeysToCamelCase } from '../../../utils'

const initialState = {
  project: undefined,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT__PROJECT_LOADED:
      return {
        ...state,
        project: deepKeysToCamelCase(result),
      }
    default:
      return state
  }
}
