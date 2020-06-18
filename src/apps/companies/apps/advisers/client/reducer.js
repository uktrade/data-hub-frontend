import { MANAGE_ADVISER__UPDATE } from '../../../../../client/actions'

export default (
  state = {
    isLeadITAUpdated: false,
    updatedLeadITA: null,
  },
  { type, result }
) =>
  type === MANAGE_ADVISER__UPDATE
    ? { ...state, isLeadITAUpdated: true, updatedLeadITA: { ...result } }
    : state
