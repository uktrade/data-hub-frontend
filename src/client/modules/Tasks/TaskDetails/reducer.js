import { COPY_TASK_DETAILS_LOADED, TASK_DETAILS_LOADED } from '../../../actions'
import { deepKeysToCamelCase } from '../../../utils'

const initialState = {
  task: undefined,
  copyTask: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case TASK_DETAILS_LOADED:
      return {
        ...state,
        copyTask: false,
        task: deepKeysToCamelCase(result),
      }
    case COPY_TASK_DETAILS_LOADED:
      return {
        ...state,
        copyTask: true,
        task: deepKeysToCamelCase(result),
      }
    default:
      return state
  }
}
