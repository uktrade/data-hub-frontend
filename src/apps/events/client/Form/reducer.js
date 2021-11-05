import { EVENTS__FORM_METADATA_LOADED } from '../../../../client/actions'

const initialState = {
  metadata: {
    eventTypeOptions: [],
    relatedTradeAgreements: [],
    eventLocationTypes: [],
    countries: [],
    teams: [],
    programmes: [],
  },
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
