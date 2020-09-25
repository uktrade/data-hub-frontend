import { fork } from 'redux-saga/effects'

import tasksSaga from './components/Task/saga'
import analyticsSaga from './components/Analytics/saga'

export default (tasks) => {
  return function* rootSaga() {
    yield fork(tasksSaga(tasks))
    yield fork(analyticsSaga)
  }
}
