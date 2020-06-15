import {
  TASK__ERROR,
  ADD_INTERACTION_FORM__SUBMIT,
  ADD_INTERACTION__GET_ACTIVE_EVENTS,
} from '../../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case TASK__ERROR:
      return {
        ...state,
        progress: false,
      }

    case ADD_INTERACTION_FORM__SUBMIT:
      return {
        ...state,
        updatedInteractionId: [200, 201].includes(result.status)
          ? result.data.id
          : undefined,
        // Keep showing the loader while we redirect user to a new page.
        progress: true,
      }

    case ADD_INTERACTION__GET_ACTIVE_EVENTS:
      return {
        ...state,
        activeEvents: result,
      }

    default:
      return state
  }
}
