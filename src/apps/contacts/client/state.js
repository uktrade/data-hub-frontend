export const TASK_GET_CONTACT_INTERACTIONS = 'TASK_GET_CONTACT_INTERACTIONS'

export const ID = 'contactInteractions'

export const state2props = ({ ...state }) => ({
  ...state[ID],
})
