import { REMINDER_SUMMARY__LOADED } from '../../actions'

const initialState = {
  count: 0,
  investment: {
    estimated_land_date: 0,
    no_recent_interaction: 0,
    outstanding_propositions: 0,
  },
  export: {
    no_recent_interaction: 0,
    new_interaction: 0,
  },
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
