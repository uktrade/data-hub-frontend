export const TASK_GET_EXPORT_WINS_SAVE_FORM = 'TASK_GET_EXPORT_WINS_SAVE_FORM'
export const ID = 'exportWinForm'

export const TASK_GET_EXPORT_PROJECT = 'TASK_GET_EXPORT_PROJECT'
export const EXPORT_PROJECT_ID = 'exportProject'

export const TASK_GET_EXPORT_WIN = 'TASK_GET_EXPORT_WIN'
export const EXPORT_WIN_ID = 'exportWin'

export const state2props = ({ router, ...state }) => ({
  csrfToken: state.csrfToken,
  currentAdviserId: state.currentAdviserId,
})
