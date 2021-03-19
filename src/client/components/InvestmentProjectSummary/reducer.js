import { INVESTMENT_SUMMARY_DATA_RANGES__LOADED } from '../../actions'

const initialState = {
  results: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT_SUMMARY_DATA_RANGES__LOADED:
      return {
        results: result,
      }
    default:
      return state
  }
}
