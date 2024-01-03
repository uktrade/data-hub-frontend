import {
  EVENTS__ATTENDEE_METADATA_LOADED,
  EVENTS__SEARCH_ATTENDEE_LIST_LOADED,
} from '../../../actions'

const initialState = {
  results: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EVENTS__SEARCH_ATTENDEE_LIST_LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case EVENTS__ATTENDEE_METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
