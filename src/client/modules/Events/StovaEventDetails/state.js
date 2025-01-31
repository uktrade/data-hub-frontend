export const TASK_GET_STOVA_EVENT_DETAILS = 'TASK_GET_STOVA_EVENT_DETAILS'

export const ID = 'stovaEventDetails'

export const state2props = ({ ...state }) => {
  return {
    ...state[ID],
  }
}
