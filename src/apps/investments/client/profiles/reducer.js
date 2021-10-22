import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED,
} from '../../../../client/actions'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
  filterOptions: {
    countries: [],
    assetClassesOfInterest: [],
    dealTicketSize: [],
    investmentTypes: [],
    minimumReturnRate: [],
    timeHorizon: [],
    restrictions: [],
    constructionRisk: [],
    minimumEquityPercentage: [],
    desiredDealRole: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENTS__PROFILES_LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results,
        isComplete: true,
      }
    case INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED:
      return {
        ...state,
        filterOptions: result,
      }
    default:
      return state
  }
}
