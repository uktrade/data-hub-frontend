import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__ADD_ITEM,
  PIPELINE__GET_ITEM,
  PIPELINE__EDIT_ITEM,
  PIPELINE__ARCHIVE_ITEM,
  PIPELINE__UNARCHIVE_ITEM,
  PIPELINE__DELETE_ITEM,
} from '../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case PIPELINE__CHECKED_IF_ON_PIPELINE:
      return {
        ...state,
        pipelineStatus: result,
      }
    case PIPELINE__ADD_ITEM:
    case PIPELINE__EDIT_ITEM:
    case PIPELINE__ARCHIVE_ITEM:
    case PIPELINE__UNARCHIVE_ITEM:
      return {
        ...state,
        savedPipelineItem: result,
      }
    case PIPELINE__GET_ITEM:
      return {
        ...state,
        currentPipelineItem: result.pipelineItem,
        contacts: result.contacts,
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
