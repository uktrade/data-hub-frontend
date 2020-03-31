import { EXPORT_COUNTRIES_EDIT__SAVE } from '../../../../../../client/actions'

import { API_ERROR, SAVED } from './state'

export default (state = {}, { type, result }) => {
  switch (type) {
    case EXPORT_COUNTRIES_EDIT__SAVE:
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

    default:
      return state
  }
}
