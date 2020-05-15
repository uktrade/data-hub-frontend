import { PIPELINE__LIST_LOADED } from '../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case PIPELINE__LIST_LOADED:
      return {
        ...state,
        items: result,
      }
    default:
      return state
  }
}
