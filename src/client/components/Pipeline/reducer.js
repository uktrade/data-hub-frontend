import {
  PIPELINE__LIST_LOADED,
  PIPELINE__FILTER_ARCHIVE_CHANGED,
} from '../../actions'

const initialState = {
  filter: {
    includeArchive: false,
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case PIPELINE__LIST_LOADED:
      return {
        ...state,
        items: result,
      }
    case PIPELINE__FILTER_ARCHIVE_CHANGED:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...result,
        },
      }
    default:
      return state
  }
}
