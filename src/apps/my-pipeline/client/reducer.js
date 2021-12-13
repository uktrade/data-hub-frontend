import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__GET_ITEM,
  PIPELINE__DELETE_ITEM,
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
    case PIPELINE__DELETE_ITEM:
      return {
        ...state,
        itemDeleted: result === 204,
      }
    default:
      return state
  }
}
