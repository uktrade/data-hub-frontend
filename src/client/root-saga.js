import { fork } from 'redux-saga/effects'

import tasksSaga from './components/Task/saga'
import analyticsSaga from './components/Analytics/saga'
import hardRedirectSaga from './components/HardRedirect/saga'
import {
  writeFlashMessages,
  readFlashMesages,
  writeAnnouncementLinkToLocalStorage,
  readAnnouncementLinkFromLocalStorage,
} from './components/LocalHeader/sagas'
import {
  writeMyInvestmentsToSession,
  readMyInvestmentsFromSession,
} from './components/MyInvestmentProjects/sagas'
import { cookiePreferenceChangeSaga } from './modules/ExportWins/Review/CookiePage/saga'

export default (tasks) => {
  return function* rootSaga() {
    yield fork(tasksSaga(tasks))
    yield fork(analyticsSaga)
    yield fork(hardRedirectSaga)
    yield fork(readFlashMesages)
    yield fork(writeFlashMessages)
    yield fork(writeAnnouncementLinkToLocalStorage)
    yield fork(readAnnouncementLinkFromLocalStorage)
    yield fork(readMyInvestmentsFromSession)
    yield fork(writeMyInvestmentsToSession)
    yield fork(cookiePreferenceChangeSaga)
  }
}
