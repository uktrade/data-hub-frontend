import {
  EVENTS__LOADED,
  EVENTS__METADATA_LOADED,
  EVENTS__SELECTED_ORGANISER,
} from '../../../actions'

const initialState = {
  results: [],
  metadata: {},
  selectedOrganisers: [],
  isComplete: false,
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
    default:
      return state
  }
}
