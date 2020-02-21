import { REFERRAL_DETAILS } from '../../../client/actions'

export default (state = {}, { type, result }) =>
  type === REFERRAL_DETAILS ? result : state
