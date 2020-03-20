import {
  SEND_REFERRAL_FORM__CONTINUE,
  SEND_REFERRAL_FORM__BACK,
  SEND_REFERRAL_FORM__ERROR,
  SEND_REFERRAL_FORM__SUBJECT_CHANGE,
  SEND_REFERRAL_FORM__ADVISER_CHANGE,
  SEND_REFERRAL_FORM__CONTACT_CHANGE,
} from '../../../../../../client/actions'

export default (state = {}, { type, errors, ...action }) => {
  switch (type) {
    case SEND_REFERRAL_FORM__ERROR:
      return {
        ...state,
        ...action,
      }
    case SEND_REFERRAL_FORM__SUBJECT_CHANGE:
      return {
        ...state,
        emptyFields: state.emptyFields?.filter((item) => item !== 'subject'),
      }
    case SEND_REFERRAL_FORM__ADVISER_CHANGE:
      return {
        ...state,
        ...action,
        emptyFields: state.emptyFields?.filter((item) => item !== 'adviser'),
      }
    case SEND_REFERRAL_FORM__CONTACT_CHANGE:
      return {
        ...state,
        ...action,
      }
    case SEND_REFERRAL_FORM__CONTINUE:
      return {
        ...action,
        confirm: true,
      }
    case SEND_REFERRAL_FORM__BACK:
      return { ...state, confirm: false }
    default:
      return state
  }
}
