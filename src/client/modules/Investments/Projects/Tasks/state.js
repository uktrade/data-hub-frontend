import { INVESTMENT_PROJECT_ID } from '../state'

export const TASK_SAVE_INVESTMENT_PROJECT_TASK =
  'TASK_SAVE_INVESTMENT_PROJECT_TASK'

export const state2props = (state) => {
  const { project } = state[INVESTMENT_PROJECT_ID]
  const currentAdviserId = state.currentAdviserId

  return {
    investmentProject: project,
    currentAdviserId,
  }
}
