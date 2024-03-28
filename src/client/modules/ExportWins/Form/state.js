import { STEP_TO_EXCLUDED_FIELDS_MAP } from './constants'

export const TASK_GET_EXPORT_WINS_SAVE_FORM = 'TASK_GET_EXPORT_WINS_SAVE_FORM'
export const ID = 'exportWinForm'

export const TASK_GET_EXPORT_PROJECT = 'TASK_GET_EXPORT_PROJECT'
export const EXPORT_PROJECT_ID = 'exportProject'

export const TASK_GET_EXPORT_WIN = 'TASK_GET_EXPORT_WIN'

export const state2props = ({ router, ...state }) => {
  // We need to know the name of the current step so we can show the
  // appropriate banner for that step. All of the steps use the step
  // name, so for consistency we shouldn't use the step index, it's one
  // or the other. We cannot use form context as that is limited to the
  // scope of the form and the banner is displayed as a child of
  // LocalHeader which is a child of DefaultLayout.
  const currentStepName = state.Form['export-win-form']?.currentStepName

  return {
    csrfToken: state.csrfToken,
    currentAdviserId: state.currentAdviserId,
    currentStepName,
    excludedStepFields: STEP_TO_EXCLUDED_FIELDS_MAP[currentStepName],
  }
}
