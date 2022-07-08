import { REMINDER_SUMMARY__LOADED } from '../../actions'

const initialState = {
  count: 0,
  summary: {
    estimated_land_date: 0,
    no_recent_investment_interaction: 0,
    outstanding_propositions: 0,
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case REMINDER_SUMMARY__LOADED:
      const count = Object.entries(result)
        .map(([, value]) => value)
        .reduce((total, value) => (total += value))

      return {
        count,
        summary: result,
      }
    default:
      return state
  }
}
