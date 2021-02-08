import { INVESTMENT_SUMMARY__LOADED } from '../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case INVESTMENT_SUMMARY__LOADED:
      return {
        ...state,
        investmentSummary: { ...result },
      }
    default:
      return state
  }
}
