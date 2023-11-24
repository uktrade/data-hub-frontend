import { MY_TASKS_LOADED } from '../../../actions'

const initialState = {
  myTasks: {},
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_TASKS_LOADED:
      return {
        ...state,
        myTasks: result,
      }
    default:
      return state
  }
}
