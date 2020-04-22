import {
  REFFERAL_LIST__LOADED,
  REFFERAL_LIST__FILTER_CHANGE,
} from '../../actions'

import { RECEIVED } from './constants'

export default (state = { filter: RECEIVED }, { type, result, filter }) => {
  switch (type) {
    case REFFERAL_LIST__LOADED:
      return { ...state, referrals: result }
    case REFFERAL_LIST__FILTER_CHANGE:
      return { ...state, filter }
    default:
      return state
  }
}
