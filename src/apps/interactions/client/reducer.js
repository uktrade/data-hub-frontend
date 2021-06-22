import {
  INTERACTIONS__LOADED,
  INTERACTIONS_SELECTED_ADVISERS,
} from '../../../client/actions'

const initialState = {
  results: [],
  metadata: {},
  selectedAdvisers: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INTERACTIONS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case INTERACTIONS_SELECTED_ADVISERS:
      return {
        ...state,
        selectedAdvisers: result,
      }
    default:
      return state
  }
}
