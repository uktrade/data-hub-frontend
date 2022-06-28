export const TASK_GET_EVENT_AVENTRI_ATTENDEES =
  'TASK_GET_EVENT_AVENTRI_ATTENDEES'

export const ID = 'eventAventriAttendees'

export const state2props = ({ ...state }) => {
  return {
    ...state[ID],
  }
}
