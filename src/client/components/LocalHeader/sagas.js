import {
  addMessage,
  addMessageWithBody,
  getMessages,
  clearMessages,
} from '../../utils/flash-messages'
import { take, put } from 'redux-saga/effects'
import { getFromLocalStorage, saveToLocalStorage } from './utils'
import {
  FLASH_MESSAGE__WRITE_TO_SESSION,
  FLASH_MESSAGE__GET_FROM_SESSION,
  FLASH_MESSAGE__ADD_TO_STATE,
  BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE,
  BANNER_DISMISSED__READ_FROM_LOCALSTORAGE,
  BANNER_DISMISSED__UPDATE_STATE,
  BANNER_DISMISSED__FLAG_ADD_STATE,
} from '../../actions'

/* Saga to write flashmessages to the session storage.

Saga listens for a FLASH_MESSAGE__WRITE_TO_SESSION action to be dispatched
and when it is, it takes the message from the action and adds it
into the session storage */
export function* writeFlashMessages() {
  while (true) {
    const { messageType, message } = yield take(FLASH_MESSAGE__WRITE_TO_SESSION)
    Array.isArray(message)
      ? addMessageWithBody(messageType, ...message)
      : addMessage(messageType, message)
  }
}

/*Saga to take flashmessages from the session storage and add
them to the redux store.

Saga listens for a FLASH_MESSAGE__GET_FROM_SESSION action to be dispatched.
Once dispatched it gets flashmessages from session storage, if
not empty it then dispatches an action FLASH_MESSAGE__ADD_TO_STATE with
the flashmessages as the body and then clears the session storage.*/
export function* readFlashMesages() {
  while (true) {
    yield take(FLASH_MESSAGE__GET_FROM_SESSION)
    const flashMessages = getMessages()
    if (Object.keys(flashMessages).length) {
      yield put({ type: FLASH_MESSAGE__ADD_TO_STATE, flashMessages })
      clearMessages()
    }
  }
}

/* Saga to write to localstorage. */
export function* writeIsBannerDismissedToLocalStorage() {
  while (true) {
    const { bannerHeading } = yield take(
      BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE
    )
    const isBannerDismissed = true
    saveToLocalStorage(bannerHeading)
    yield put({
      type: BANNER_DISMISSED__FLAG_ADD_STATE,
      isBannerDismissed,
    })
  }
}

/* Saga to read localstorage state and add to redux state. */
export function* readIsBannerDismissedFromLocalStorage() {
  while (true) {
    yield take(BANNER_DISMISSED__READ_FROM_LOCALSTORAGE)
    const bannerHeading = getFromLocalStorage()
    yield put({
      type: BANNER_DISMISSED__UPDATE_STATE,
      bannerHeading,
    })
  }
}
