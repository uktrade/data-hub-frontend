import { MY_INVESTMENTS__CHECK_COMPLETE } from '../../actions'

const initialState = {
  hasInvestmentProjects: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_INVESTMENTS__CHECK_COMPLETE:
      const { results } = result
      return {
        ...state,
        hasInvestmentProjects: !!results.length,
      }
    default:
      return state
  }
}
