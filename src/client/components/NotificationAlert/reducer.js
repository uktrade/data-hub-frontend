import { NOTIFICATION_ALERT_COUNT__LOADED } from '../../actions'

const initialState = {
  count: 0,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case NOTIFICATION_ALERT_COUNT__LOADED:
      return {
        ...result,
      }
    default:
      return state
  }
}
