import { REMINDER_SUMMARY__LOADED } from '../../actions'

const initialState = {
  count: 0,
  investment: [],
  export: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case REMINDER_SUMMARY__LOADED:
      return {
        ...result,
      }
    default:
      return state
  }
}
