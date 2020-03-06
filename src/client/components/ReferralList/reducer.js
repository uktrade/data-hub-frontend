import { REFFERAL_LIST__LOADED } from '../../actions'

export default (state = null, { type, result }) =>
  type === REFFERAL_LIST__LOADED ? { referrals: result } : state
