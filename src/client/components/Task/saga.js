import _ from 'lodash'
import { take, put, spawn, call, select } from 'redux-saga/effects'

import {
  TASK__START,
  TASK__PROGRESS,
  TASK__SUCCESS,
  TASK__ERROR,
  TASK__CLEAR,
} from '../../actions'

function* taskSaga(task, action) {
  yield put({ ...action, type: TASK__PROGRESS })
  try {
    const result = yield call(task, action.payload)
    const { id, name } = action
    yield put({
      type: action.successActionType,
      payload: action.payload,
      result,
    })
    yield put({ type: TASK__SUCCESS, id, name })
    const clearOnSuccess = yield select((state) =>
      _.get(state, ['tasks', name, id, 'clearOnSuccess'])
    )
    if (clearOnSuccess) {
      yield put({ type: TASK__CLEAR, id, name })
    }
  } catch (error) {
    const { id, name } = action
    yield put({
      type: TASK__ERROR,
      id,
      name,
      error: error.message,
    })
  }
}

export default (registry) =>
  function* tasksSaga() {
    while (true) {
      const action = yield take(TASK__START)
      const { name, id } = action
      const task = registry[action.name]
      if (!task) {
        throw Error(`Task "${name}" is not registered!`)
      }
      const status = yield select((state) =>
        _.get(state, ['tasks', name, id, 'status'])
      )
      if (status === 'progress') {
        throw Error(
          `Cannot start task "${name}.${id}" because it is already in progress!`
        )
      }
      yield spawn(taskSaga, task, action)
    }
  }
