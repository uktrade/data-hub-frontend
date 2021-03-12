import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

const initialState = {
  outstandingPropositions: {
    count: 0,
    results: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case OUTSTANDING_PROPOSITIONS__LOADED:
      const { results, count } = result
      return {
        outstandingPropositions: {
          results,
          count,
        },
      }
    default:
      return state
  }
}
