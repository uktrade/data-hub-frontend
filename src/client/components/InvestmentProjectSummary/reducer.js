import { INVESTMENT_SUMMARY_DATA_RANGES__LOADED } from '../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case INVESTMENT_SUMMARY_DATA_RANGES__LOADED:
      return {
        investmentSummaryDataRanges: result,
      }
    default:
      return state
  }
}
