import { MY_TASKS_CHECK_COMPLETE } from '../../../actions'

const initialState = { checkCompleteCount: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_TASKS_CHECK_COMPLETE:
      return {
        ...state,
        checkCompleteCount: result,
      }
    default:
      return state
  }
}
