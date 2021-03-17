import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

const initialState = {
  outstandingPropositions: {
    count: 0,
    results: [],
    loaded: false,
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
          loaded: true,
        },
      }
    default:
      return state
  }
}
