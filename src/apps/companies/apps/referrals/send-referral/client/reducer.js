import {
  SEND_REFERRAL_FORM__SUBMIT,
  TASK__ERROR,
} from '../../../../../../client/actions'

// eslint-disable-next-line no-unused-vars
export default (state = {}, { type }) => {
  switch (type) {
    case TASK__ERROR:
      return {
        ...state,
        progress: false,
      }

    case SEND_REFERRAL_FORM__SUBMIT:
      return {
        ...state,
        progress: true,
        formSubmitted: true,
      }
    default:
      return state
  }
}
