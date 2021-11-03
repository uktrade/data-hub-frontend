import { EVENTS__FORM_METADATA_LOADED } from '../../../../client/actions'

const initialState = {
  metadata: { eventTypeOptions: [] },
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case EVENTS__FORM_METADATA_LOADED:
      return {
        ...state,
        metadata: result,
        isComplete: true,
      }
    default:
      return state
  }
}
