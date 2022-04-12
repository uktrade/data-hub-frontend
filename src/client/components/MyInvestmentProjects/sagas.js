import { put, take } from 'redux-saga/effects'
import {
  MY_INVESTMENTS__SAVE_TO_SESSION,
  MY_INVESTMENTS__GET_FROM_SESSION,
  MY_INVESTMENTS__ADD_TO_STATE,
} from '../../actions'
import { saveToSession, getFromSession } from './utils'

/* Saga to write to session storage. */
export function* writeMyInvestmentsToSession() {
  while (true) {
    const { type, ...payload } = yield take(MY_INVESTMENTS__SAVE_TO_SESSION)
    saveToSession(payload)
  }
}

/* Saga to read session state and add to redux state. */
export function* readMyInvestmentsFromSession() {
  while (true) {
    yield take(MY_INVESTMENTS__GET_FROM_SESSION)
    const sessionState = getFromSession()
    if (Object.keys(sessionState).length) {
      yield put({ type: MY_INVESTMENTS__ADD_TO_STATE, sessionState })
    }
  }
}
