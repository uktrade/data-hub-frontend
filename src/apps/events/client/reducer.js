import {
  EVENTS__LOADED,
  EVENTS__METADATA_LOADED,
  EVENTS__SELECTED_ORGANISER,
  EVENTS__DETAILS_LOADED,
} from '../../../client/actions'

const initialState = {
  results: [],
  metadata: {},
  selectedOrganisers: [],
  isComplete: false,
  eventDetails: {},
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EVENTS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case EVENTS__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    case EVENTS__SELECTED_ORGANISER:
      return {
        ...state,
        selectedOrganisers: result,
      }
    case EVENTS__DETAILS_LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    default:
      return state
  }
}
