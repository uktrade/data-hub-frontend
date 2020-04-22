import {
  REFERRAL_LIST__LOADED,
  REFERRAL_LIST__FILTER_CHANGE,
} from '../../actions'

import { RECEIVED } from './constants'

export default (state = { filter: RECEIVED }, { type, result, filter }) => {
  switch (type) {
    case REFERRAL_LIST__LOADED:
      return { ...state, referrals: result }
    case REFERRAL_LIST__FILTER_CHANGE:
      return { ...state, filter }
    default:
      return state
  }
}
