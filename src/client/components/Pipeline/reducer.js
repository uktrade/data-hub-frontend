import {
  PIPELINE__LIST_LOADED,
  PIPELINE__LIST_FILTER_SORT_CHANGED,
} from '../../actions'

const initialState = {
  lists: {},
  filter: {
    sortBy: '-created_on',
    includeArchive: false,
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case PIPELINE__LIST_LOADED:
      return {
        ...state,
        lists: {
          ...state.lists,
          ...result,
        },
      }
    case PIPELINE__LIST_FILTER_SORT_CHANGED:
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
