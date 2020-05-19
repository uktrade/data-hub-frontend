import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__ADD_COMPANY_SUCCESS,
} from '../../../../../client/actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case PIPELINE__CHECKED_IF_ON_PIPELINE:
      return {
        ...state,
        pipelineStatus: result,
      }
    case PIPELINE__ADD_COMPANY_SUCCESS:
      return {
        ...state,
        savedId: result,
      }
    default:
      return state
  }
}
