import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

const initialState = {
  count: 0,
  results: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case OUTSTANDING_PROPOSITIONS__LOADED:
      const { count, investmentELD, investmentNRI, investmentOP } = result
      return {
        count,
        investmentELD,
        investmentNRI,
        investmentOP,
      }
    default:
      return state
  }
}
