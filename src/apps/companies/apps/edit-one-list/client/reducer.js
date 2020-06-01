import { EDIT_ONE_LIST_DETAILS__SUBMIT } from '../../../../../client/actions'

import { API_ERROR, SAVED } from './state'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EDIT_ONE_LIST_DETAILS__SUBMIT:
      if (result[API_ERROR]) {
        return {
          ...state,
          [API_ERROR]: result[API_ERROR],
        }
      }

      if (result[SAVED]) {
        return {
          ...state,
          [SAVED]: result[SAVED],
        }
      }

      return state

    default:
      return state
  }
}
