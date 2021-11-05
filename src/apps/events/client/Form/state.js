export const ID = 'eventForm'

export const TASK_GET_EVENTS_FORM_METADATA = 'TASK_GET_EVENTS_FORM_METADATA'
export const TASK_SAVE_EVENT = 'TASK_SAVE_EVENT'

export const state2props = ({ ...state }) => ({
  ...state[ID],
})
