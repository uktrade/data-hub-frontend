import { DNB__CHECK_PENDING_REQUEST } from '../../../../../client/actions'

export default (
  state = {
    isDnbPending: false,
  },
  { type, result }
) =>
  type === DNB__CHECK_PENDING_REQUEST
    ? { ...state, isDnbPending: result }
    : state
