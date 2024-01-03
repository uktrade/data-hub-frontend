import { TASK_DETAILS_LOADED } from '../../../actions'
import { deepKeysToCamelCase } from '../../../utils'

const initialState = {
  task: undefined,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case TASK_DETAILS_LOADED:
      return {
        ...state,
        task: deepKeysToCamelCase(result),
      }
    default:
      return state
  }
}
