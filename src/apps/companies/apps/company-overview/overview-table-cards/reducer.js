import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'

const initialState = {
  results: [],
  stage: [],
  selectedAdvisers: [],
  metadata: {},
  isComplete: false,
}

export default (state = { initialState }, { type, result }) => {
  if (type === OVERVIEW__COMPANY_INVESTMENT_WON_COUNT) {
    return {
      ...state,
      count: result.count,
      results: result.results,
      isComplete: true,
    }
  }
  return state
}
