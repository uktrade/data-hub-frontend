import { transformAPIValuesForForm } from './transformers'

export const TASK_SAVE_OBJECTIVE = 'TASK_SAVE_OBJECTIVE'
export const TASK_GET_OBJECTIVE = 'TASK_GET_OBJECTIVE'
export const TASK_SAVE_STRATEGY = 'TASK_SAVE_STRATEGY'
export const TASK_ARCHIVE_OBJECTIVE = 'TASK_ARCHIVE_OBJECTIVE'

export const ID = 'objective'

export const state2props = (state) => {
  const objectiveItem = state[ID].objectiveItem
  if (objectiveItem) {
    return { objectiveItem: transformAPIValuesForForm(objectiveItem) }
  }
  return { objectiveItem }
}

export const state2propsMainTab = (state) => {
  const { currentAdviserId } = state
  return {
    permissions: state.userPermissions,
    currentAdviserId: currentAdviserId,
  }
}
