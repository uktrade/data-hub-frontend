import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

const initialState = {
  count: 0,
  results: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case OUTSTANDING_PROPOSITIONS__LOADED:
      const { results, count } = result
      return {
        results,
        count,
      }
    default:
      return state
  }
}
