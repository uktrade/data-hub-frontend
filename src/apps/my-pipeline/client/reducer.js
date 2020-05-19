import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__ADD_COMPANY_SUCCESS,
  PIPELINE__GET_PIPELINE_SUCCESS,
  PIPELINE__EDIT_PIPELINE_SUCCESS,
} from '../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case PIPELINE__CHECKED_IF_ON_PIPELINE:
      return {
        ...state,
        pipelineStatus: result,
      }
    case PIPELINE__ADD_COMPANY_SUCCESS:
    case PIPELINE__EDIT_PIPELINE_SUCCESS:
      return {
        ...state,
        savedId: result,
      }
    case PIPELINE__GET_PIPELINE_SUCCESS:
      return {
        ...state,
        currentPipeline: result,
      }
    default:
      return state
  }
}
