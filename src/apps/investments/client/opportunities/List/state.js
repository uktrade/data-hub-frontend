export const TASK_GET_OPPORTUNITIES_LIST = 'TASK_GET_OPPORTUNITIES_LIST'

export const ID = 'opportunitiesList'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
