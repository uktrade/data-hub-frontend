import { PIPELINE__CHECKED_IF_ON_PIPELINE } from '../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case PIPELINE__CHECKED_IF_ON_PIPELINE:
      return {
        ...state,
        isOnPipeline: result,
      }
    default:
      return state
  }
}
