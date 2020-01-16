import _ from 'lodash'
import {
  TASK__PROGRESS,
  TASK__ERROR,
  TASK__SUCCESS,
  TASK__CLEAR,
} from '../../actions'

const setTaskState = (state, { name, id, ...action }, status, omit) => {
  const currentTaskGroup = state[name] || {}
  const currentTask = currentTaskGroup[id]
  return {
    ...state,
    [name]: {
      ...currentTaskGroup,
      [id]: {
        ..._.omit(currentTask, omit),
        ...action,
        status,
      },
    },
  }
}

export default (state = {}, { type, ...action }) => {
  switch (type) {
    case TASK__PROGRESS:
      return setTaskState(state, action, 'progress')
    case TASK__SUCCESS:
      return setTaskState(state, action, 'success', [
        'payload',
        'successActionType',
      ])
    case TASK__ERROR:
      return setTaskState(state, action, 'error')
    case TASK__CLEAR:
      return _.omit(state, `${action.name}.${action.id}`)
    default:
      return state
  }
}
