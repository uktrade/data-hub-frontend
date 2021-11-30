import { take } from 'redux-saga/effects'
import { ANALYTICS__PUSH } from '../../actions'

/* This saga pushes data, passed when dispatching the ANALYTICS__PUSH
action from within the Analytics component, to the Google Tag Manager
data layer. */

export default function* () {
  while (true) {
    const { category, action, label, extra } = yield take(ANALYTICS__PUSH)

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      ...extra,
      event: 'gaEvent',
      category,
      action,
      label,
    })
  }
}
