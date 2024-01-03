import {
  COMPANIES__LOADED,
  COMPANIES__METADATA_LOADED,
} from '../../../../actions'

const initialState = {
  results: [],
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
    default:
      return state
  }
}
