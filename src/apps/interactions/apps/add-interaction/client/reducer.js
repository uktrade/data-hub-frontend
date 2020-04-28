import {
  ADD_INTERACTION_FORM__SUBMIT,
  TASK__ERROR,
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
        newInteractionId: result.status === 201 ? result.data.id : undefined,
        // Keep showing the loader while we redirect user a new page.
        progress: true,
      }

    default:
      return state
  }
}
