import {
  INVESTMENT__COMPANY_SEARCH_TERM,
  INVESTMENT__SEARCH_COMPANY_LIST_LOADED,
  INVESTMENT__COMPANY_INVESTMENT_COUNT,
} from '../../../../../client/actions'

const initialState = {
  results: null,
  searchTerm: '',
  companyInvestmentCount: 0,
}

export default (state = initialState, { type, result, searchTerm }) => {
  switch (type) {
    case INVESTMENT__COMPANY_INVESTMENT_COUNT:
      return {
        ...state,
        companyInvestmentCount: result.count,
      }
    case INVESTMENT__SEARCH_COMPANY_LIST_LOADED:
      return {
        ...state,
        results: result.results,
      }
    case INVESTMENT__COMPANY_SEARCH_TERM:
      return {
        ...state,
        searchTerm,
      }
    default:
      return state
  }
}
