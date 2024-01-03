import {
  MY_INVESTMENTS__CHECK_COMPLETE,
  DATA_HUB_FEED__FETCHED,
  MY_TASKS_CHECK_COMPLETE,
} from '../../actions'

const initialState = {
  hasInvestmentProjects: false,
  summary: [],
  dataHubFeed: [],
  hasTasks: false,
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
    case MY_TASKS_CHECK_COMPLETE:
      return {
        ...state,
        hasTasks: result,
      }
    default:
      return state
  }
}
