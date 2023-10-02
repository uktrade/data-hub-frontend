import { ID as TASK_ID } from '../../../Tasks/TaskDetails/state'
import { INVESTMENT_PROJECT_ID } from '../state'
import { transformAPIValuesForForm } from './transformers'

export const TASK_SAVE_INVESTMENT_PROJECT_TASK =
  'TASK_SAVE_INVESTMENT_PROJECT_TASK'

export const state2props = (state) => {
  const { project } = state[INVESTMENT_PROJECT_ID]
  const { task } = state[TASK_ID]
  const currentAdviserId = state.currentAdviserId

  return {
    investmentProject: project,
    currentAdviserId,
    task: task ? transformAPIValuesForForm(task) : '',
  }
}
