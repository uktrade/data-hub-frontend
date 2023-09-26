export const ID = 'taskDetails'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
