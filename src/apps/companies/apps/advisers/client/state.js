export const ID = 'manageAdviser'

export const TASK_UPDATE_ADVISER = 'TASK_UPDATE_ADVISER'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
