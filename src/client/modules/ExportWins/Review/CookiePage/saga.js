import { put, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

const storageChannel = eventChannel((emit) => {
  window.addEventListener('storage', emit)
  return () => window.removeEventListener(emit)
})

/**
 * This ensures that when the user sets their cookie preference
 * in one browser tab, all the other tabs will pick up the change.
 */
// TODO: Once Redux state is persisted in session storage, this should not be needed
export function* cookiePreferenceChangeSaga() {
  while (true) {
    const { key, newValue } = yield take(storageChannel)
    if (key === 'cookie-consent') {
      yield put({
        type: 'RESOURCE',
        name: 'load cookie preference',
        id: 'cookieConsent',
        result: newValue,
      })
    }
  }
}
