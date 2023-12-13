export const ID = 'taskDetails'

export const TASK_GET_TASK_DETAILS = 'TASK_GET_TASK_DETAILS'
export const TASK_ARCHIVE_TASK = 'TASK_ARCHIVE_TASK'

export const state2props = (state) => ({ ...state[ID] })
