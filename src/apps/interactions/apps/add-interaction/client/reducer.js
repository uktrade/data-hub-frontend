import { ADD_INTERACTION_FORM__SUBMIT } from '../../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case ADD_INTERACTION_FORM__SUBMIT:
      return {
        ...state,
        newInteractionId: result.status === 201 ? result.data.id : undefined,
      }

    default:
      return state
  }
}
