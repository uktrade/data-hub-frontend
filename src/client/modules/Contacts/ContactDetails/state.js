export const ID = 'contactDetails'

export const TASK_ARCHIVE_CONTACT = 'TASK_ARCHIVE_CONTACT'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
