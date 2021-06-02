import {
  COMPANIES__LOADED,
  COMPANIES__SET_COMPANIES_METADATA,
} from '../../../client/actions'

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
    case COMPANIES__SET_COMPANIES_METADATA:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
