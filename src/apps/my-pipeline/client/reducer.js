import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__GET_ITEM,
} from '../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case PIPELINE__CHECKED_IF_ON_PIPELINE:
      return {
        ...state,
        pipelineStatus: result,
      }
    case PIPELINE__GET_ITEM:
      return {
        ...state,
        currentPipelineItem: result,
      }
    default:
      return state
  }
}
