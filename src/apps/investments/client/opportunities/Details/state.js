export const TASK_GET_OPPORTUNITIES_LIST = 'TASK_GET_OPPORTUNITIES_LIST'

export const ID = 'opportunityDetails'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
