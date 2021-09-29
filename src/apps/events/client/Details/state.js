export const TASK_GET_EVENT_DETAILS = 'TASK_GET_EVENT_DETAILS'

export const ID = 'eventDetails'

export const state2props = ({ ...state }) => ({
  ...state[ID],
})
