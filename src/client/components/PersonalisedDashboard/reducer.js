import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case OUTSTANDING_PROPOSITIONS__LOADED:
      return {
        outstandingPropositions: result,
      }
    default:
      return state
  }
}
