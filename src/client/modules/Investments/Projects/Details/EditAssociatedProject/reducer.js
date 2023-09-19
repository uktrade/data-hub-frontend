import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__SET_PROJECTS_METADATA,
} from '../../../../../actions'

const initialState = {
  results: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENTS__PROJECTS_LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results,
        isComplete: true,
      }
    case INVESTMENTS__SET_PROJECTS_METADATA:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
