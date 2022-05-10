import {
  MY_INVESTMENTS__CHECK_COMPLETE,
  DATA_HUB_FEED__FETCHED,
} from '../../actions'

const initialState = {
  hasInvestmentProjects: false,
  summary: [],
  dataHubFeed: [],
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
    case DATA_HUB_FEED__FETCHED:
      const { dataHubFeed } = result
      return {
        ...state,
        dataHubFeed,
      }
    default:
      return state
  }
}
