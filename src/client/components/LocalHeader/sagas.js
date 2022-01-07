import { addMessage, addMessageWithBody } from '../../utils/flash-messages'
import { take } from 'redux-saga/effects'

import { FLASH_MESSAGE__WRITE_TO_SESSION } from '../../actions'

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
