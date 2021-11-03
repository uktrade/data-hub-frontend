export const ID = 'eventForm'

export const TASK_GET_EVENTS_FORM_METADATA = 'TASK_GET_EVENTS_FORM_METADATA'

export const state2props = ({ ...state }) => ({
  ...state[ID],
})
