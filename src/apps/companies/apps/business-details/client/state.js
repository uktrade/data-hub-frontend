export const ID = 'dnbCheckPendingRequest'

export const DNB__CHECK_PENDING_REQUEST = 'DNB__CHECK_PENDING_REQUEST'
export const TASK_ARCHIVE_COMPANY = 'TASK_ARCHIVE_COMPANY'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
