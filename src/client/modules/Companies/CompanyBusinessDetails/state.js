export const ID = 'dnbCheckPendingRequest'

export const DNB__CHECK_PENDING_REQUEST = 'DNB__CHECK_PENDING_REQUEST'
export const TASK_ARCHIVE_COMPANY = 'TASK_ARCHIVE_COMPANY'
export const TASK_GET_GLOBAL_ULTIMATE = 'TASK_GET_GLOBAL_ULTIMATE'

export const state2props = ({ values, ...state }) => {
  const { currentAdviserId } = state
  return {
    currentAdviserId: currentAdviserId,
    csrfToken: state.csrfToken,
    userPermissions: state.userPermissions,
    ...state[ID],
    values,
  }
}
