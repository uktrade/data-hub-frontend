import { MY_INVESTMENTS__CHECK_COMPLETE } from '../../actions'

const initialState = {
  hasInvestmentProjects: false,
  summary: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_INVESTMENTS__CHECK_COMPLETE:
      const { hasInvestmentProjects, summary } = result
      return {
        ...state,
        hasInvestmentProjects,
        summary,
      }
    default:
      return state
  }
}
