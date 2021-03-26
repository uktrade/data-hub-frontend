import { take } from 'redux-saga/effects'

import { HARD_REDIRECT } from '../../actions'

export default function* redirect() {
  while (true) {
    window.location.href = (yield take(HARD_REDIRECT)).to
  }
}
