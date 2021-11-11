import { ADD_INTERACTION__GET_ACTIVE_EVENTS } from '../../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case ADD_INTERACTION__GET_ACTIVE_EVENTS:
      return {
        ...state,
        activeEvents: result,
      }

    default:
      return state
  }
}
