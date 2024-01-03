export const TASK_GET_EXPORT_DETAIL = 'TASK_GET_EXPORT_DETAIL'

export const ID = 'exportDetails'

export const state2props = ({ ...state }) => ({
  exportItem: state[ID].exportItem,
})
