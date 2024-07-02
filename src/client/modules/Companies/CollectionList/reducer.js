import {
  COMPANIES__LOADED,
  COMPANIES__METADATA_LOADED,
  COMPANIES__SELECTED_ADVISERS,
  COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER,
} from '../../../actions'

const initialState = {
  results: [],
  selectedLeadItaOrGlobalAccountManagers: [],
  advisers: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANIES__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case COMPANIES__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    case COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER:
      return {
        ...state,
        selectedLeadItaOrGlobalAccountManagers: result,
      }
    case COMPANIES__SELECTED_ADVISERS:
      return {
        ...state,
        advisers: result,
      }
    default:
      return state
  }
}
