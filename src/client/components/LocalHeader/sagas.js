import { take, put } from 'redux-saga/effects'

import {
  addMessage,
  addMessageWithBody,
  getMessages,
  clearMessages,
} from '../../utils/flash-messages'
import { readFromLocalStorage, writeToLocalStorage } from './utils'
import {
  FLASH_MESSAGE__WRITE_TO_SESSION,
  FLASH_MESSAGE__GET_FROM_SESSION,
  FLASH_MESSAGE__ADD_TO_STATE,
  LATEST_ANNOUNCEMENT__WRITE_TO_LOCALSTORAGE,
  LATEST_ANNOUNCEMENT__READ_FROM_LOCALSTORAGE,
  LATEST_ANNOUNCEMENT__UPDATE_STATE,
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

/* Saga to write to local storage. */
export function* writeAnnouncementLinkToLocalStorage() {
  while (true) {
    const { announcementLink } = yield take(
      LATEST_ANNOUNCEMENT__WRITE_TO_LOCALSTORAGE
    )
    if (announcementLink) {
      writeToLocalStorage(announcementLink)
      yield put({
        type: LATEST_ANNOUNCEMENT__UPDATE_STATE,
        announcementLink,
      })
    }
  }
}

/* Saga to read local storage state and add to redux state. */
export function* readAnnouncementLinkFromLocalStorage() {
  while (true) {
    yield take(LATEST_ANNOUNCEMENT__READ_FROM_LOCALSTORAGE)
    const announcementLink = readFromLocalStorage()
    if (announcementLink) {
      yield put({
        type: LATEST_ANNOUNCEMENT__UPDATE_STATE,
        announcementLink,
      })
    }
  }
}
