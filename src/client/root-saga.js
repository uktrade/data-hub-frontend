import { fork } from 'redux-saga/effects'

import tasksSaga from './components/Task/saga'
import analyticsSaga from './components/Analytics/saga'
import hardRedirectSaga from './components/HardRedirect/saga'
import {
  writeFlashMessages,
  readFlashMesages,
} from './components/LocalHeader/sagas'
import {
  writeMyInvestmentsToSession,
  readMyInvestmentsFromSession,
} from './components/MyInvestmentProjects/sagas'

export default (tasks) => {
  return function* rootSaga() {
    yield fork(tasksSaga(tasks))
    yield fork(analyticsSaga)
    yield fork(hardRedirectSaga)
    yield fork(readFlashMesages)
    yield fork(writeFlashMessages)
    yield fork(readMyInvestmentsFromSession)
    yield fork(writeMyInvestmentsToSession)
  }
}
