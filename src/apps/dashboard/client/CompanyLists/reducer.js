import { FILTER_CHANGE, LIST_CHANGE, ORDER_CHANGE } from './actions'

export const initialState = {
  lists: [],
  selectedIdx: 0,
  sortBy: 'recent',
  filter: '',
}

export default (state = initialState, { type, ...action }) => {
  switch (type) {
    case LIST_CHANGE:
      return { ...state, filter: '', selectedIdx: action.idx }
    case FILTER_CHANGE:
      return { ...state, filter: action.filter }
    case ORDER_CHANGE:
      return { ...state, sortBy: action.sortBy }
    default:
      return state
  }
}
