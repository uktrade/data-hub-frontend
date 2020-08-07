export const ID = 'dnbCheckPendingRequest'

export const DNB__CHECK_PENDING_REQUEST = 'DNB__CHECK_PENDING_REQUEST'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
