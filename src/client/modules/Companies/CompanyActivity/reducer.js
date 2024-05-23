import {
  COMPANY_ACTIVITIES__LOADED,
  COMPANY_ACTIVITIES_SELECTED_ADVISERS,
  COMPANY_ACTIVITIES_SELECTED_COMPANIES,
  COMPANY_ACTIVITIES__METADATA_LOADED,
  COMPANY_ACTIVITIES_SELECTED_TEAMS,
} from '../../../actions'

const initialState = {
  results: [],
  metadata: {},
  selectedAdvisers: [],
  selectedTeams: [],
  selectedCompanies: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANY_ACTIVITIES__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case COMPANY_ACTIVITIES_SELECTED_ADVISERS:
      return {
        ...state,
        selectedAdvisers: result,
      }
    case COMPANY_ACTIVITIES_SELECTED_COMPANIES:
      return {
        ...state,
        selectedCompanies: result,
      }
    case COMPANY_ACTIVITIES__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    case COMPANY_ACTIVITIES_SELECTED_TEAMS:
      return {
        ...state,
        selectedTeams: result,
      }
    default:
      return state
  }
}
