import { MY_INVESTMENTS__LIST_LOADED } from '../../actions'

const initialState = {}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_INVESTMENTS__LIST_LOADED:
      return {
        ...state,
        items: [...result],
      }
    default:
      return state
  }
}
