import { INVESTMENT_PROJECT_ID } from '../../Investments/Projects/state'
import { ID as TASK_DETAILS_ID } from '../TaskDetails/state'
import { transformAPIValuesForForm } from './transformers'

export const TASK_SAVE_TASK_DETAILS = 'TASK_SAVE_TASK_DETAILS'

export const state2props = (state) => {
  const currentAdviserId = state.currentAdviserId
  const { task } = state[TASK_DETAILS_ID]
  const { project } = state[INVESTMENT_PROJECT_ID]

  if (task) {
    return {
      task: transformAPIValuesForForm(task, currentAdviserId),
      currentAdviserId,
    }
  }

  if (project) {
    return { task: { investmentProject: project }, currentAdviserId }
  }

  return { task: null }
}
